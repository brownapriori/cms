import {UploadIcon} from '@sanity/icons'
import {Box, Button, Card, Dialog, Spinner, Stack, Text} from '@sanity/ui'
import {PDFDict, PDFDocument, PDFName} from 'pdf-lib'
import {useRef, useState} from 'react'
import type {AssetFromSource, AssetSource, AssetSourceComponentProps} from 'sanity'

async function sanitizePdf(file: File): Promise<File> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), {
    updateMetadata: false,
  })

  // A PDF can expose its title through both the document information
  // dictionary and its XMP metadata stream. Remove both sources so native
  // browser PDF viewers fall back to the response filename.
  const infoReference = pdf.context.trailerInfo.Info
  if (infoReference) {
    const info = pdf.context.lookup(infoReference)
    if (info instanceof PDFDict) {
      info.delete(PDFName.of('Title'))
    }
  }

  pdf.catalog.delete(PDFName.of('Metadata'))
  pdf.catalog.getOrCreateViewerPreferences().setDisplayDocTitle(false)

  const bytes = await pdf.save()
  const contents = new Uint8Array(bytes.byteLength)
  contents.set(bytes)

  return new File([contents.buffer], file.name, {
    type: 'application/pdf',
    lastModified: file.lastModified,
  })
}

function SanitizedPdfAssetSource({
  accept,
  dialogHeaderTitle,
  onClose,
  onSelect,
}: AssetSourceComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    setError(null)
    setIsProcessing(true)

    try {
      if (
        file.type &&
        file.type !== 'application/pdf' &&
        !file.name.toLowerCase().endsWith('.pdf')
      ) {
        throw new Error('Please select a PDF file.')
      }

      const sanitizedFile = await sanitizePdf(file)
      // Sanity's runtime accepts a browser File here, although its generated
      // type currently collides with Sanity's schema-level File type.
      onSelect([{kind: 'file', value: sanitizedFile} as unknown as AssetFromSource])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sanitize this PDF.')
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      id="sanitized-pdf-asset-source"
      header={dialogHeaderTitle ?? 'Upload PDF'}
      onClose={() => {
        if (!isProcessing) onClose()
      }}
      open
      width={1}
    >
      <Card padding={4}>
        <Stack space={4}>
          <Text size={1} muted>
            The PDF title metadata is removed in your browser before the file is uploaded to
            Sanity.
          </Text>

          <Box>
            <Button
              disabled={isProcessing}
              icon={isProcessing ? Spinner : UploadIcon}
              onClick={() => inputRef.current?.click()}
              text={isProcessing ? 'Cleaning PDF…' : 'Choose PDF'}
              tone="primary"
            />
            <input
              accept={accept || '.pdf,application/pdf'}
              aria-label="Choose PDF to upload"
              disabled={isProcessing}
              hidden
              onChange={(event) => void handleFile(event.currentTarget.files?.[0])}
              ref={inputRef}
              type="file"
            />
          </Box>

          {error && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Dialog>
  )
}

export const sanitizedPdfAssetSource: AssetSource = {
  name: 'sanitized-pdf',
  title: 'Upload sanitized PDF',
  icon: UploadIcon,
  component: SanitizedPdfAssetSource,
}
