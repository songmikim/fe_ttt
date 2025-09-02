import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { color, category } from '../libs'
import styled, { css } from 'styled-components'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import LayerPopup from '@/app/_global/components/LayerPopup'

const Wrapper = styled.div<{ width?: number; height?: number }>`
  position: relative;

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}

  video {
    display: none;
  }

  .layer {
    position: absolute;
    top: 0;
    left: 0;
  }
`

type PropType = {
  width?: number
  height?: number
  callback: (items: any) => void
}

const DetectObject = ({ width, height, callback }: PropType) => {
  const [guideOpen, setGuideOpen] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const layerRef = useRef<HTMLCanvasElement | null>(null)

  const dialogRef = useRef<boolean>(false)
  const alertDialog = useAlertDialog()
  const router = useRouter()

  width = width ?? 500
  height = height ?? 500

  // 카메라 권한 설정 안내 팝업 닫기
  const onPopupClose = useCallback(() => {
    setGuideOpen(false)
    router.replace('/') // 팝업 닫으면 메인 페이지로 이동
  }, [router])

  const detect = useCallback(() => {
    const canvas = canvasRef.current
    const layer = layerRef.current
    if (!canvas || !layer) return

    const ctx = layer.getContext('2d')
    if (!ctx) return

    ctx.lineWidth = 5
    ctx.fillStyle = 'transparent'
    ctx.strokeStyle = 'red'
    ctx.font = "17px 'KyoboHandwriting2019', sans-serif"
    ctx.clearRect(0, 0, width, height)

    canvas.toBlob((blob) => {
      if (!blob) return

      const formData = new FormData()
      formData.append('file', blob, 'canvas.jpg')

      fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/detect`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((items) => {
          const callbackItems: Array<{
            category1: string
            category2: string
            dataUrl: string | null
            blob: Blob | null
          }> = []
          for (const [x1, y1, x2, y2, , , cls] of items) {
            const w = Math.abs(x2 - x1)
            const h = Math.abs(y2 - y1)

            ctx.strokeStyle = color[cls]
            ctx.strokeRect(x1, y1, w, h)

            ctx.fillStyle = color[cls]
            ctx.fillRect(x1, y1, w, 25)

            const textColor = category[cls] === '비닐' ? '#000' : '#fff'
            ctx.fillStyle = textColor
            ctx.fillText(category[cls], x1 + 10, y1 + 16)

            const img = new Image()
            img.src = canvas.toDataURL()

            const cropCanvas = document.createElement('canvas')
            cropCanvas.width = w
            cropCanvas.height = h
            const ctxCrop = cropCanvas.getContext('2d')

            if (ctxCrop) {
              img.onload = () => {
                ctxCrop.drawImage(img, x1, y1, w, h, 0, 0, w, h)
                const dataUrl = cropCanvas.toDataURL()
                cropCanvas.toBlob((blob) => {
                  callbackItems.push({
                    category1: cls,
                    category2: category[cls],
                    dataUrl,
                    blob,
                  })

                  // 후속처리 함수 호출
                  callback(callbackItems)
                })
              }
            }
          }
        })
    })
  }, [canvasRef, layerRef, width, height, callback])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    let videoInterval, detectInterval

    navigator.mediaDevices
      .getUserMedia({
        video: { width, height },
        audio: false,
      })
      .then((stream) => {
        if (video) video.srcObject = stream

        detectInterval = setInterval(() => {
          detect()
        }, 1000)
      })
      .catch(() => {
        // 웹캠이 설치되어 있지 않거나, 웹캠 권한을 허용하지 않은 경우..
        if (!dialogRef.current) {
          dialogRef.current = true
          alertDialog({
            text: '웹캠을 설치하시거나, 권한을 설정해주세요.',
            icon: 'error',
            callback: () => {
              setGuideOpen(true)
            },
          })
        }
      })

    const ctx = canvas?.getContext('2d')
    video?.addEventListener('play', () => {
      videoInterval = setInterval(() => {
        ctx?.drawImage(video, 0, 0, canvas?.width ?? 500, canvas?.height ?? 500)
      }, 0)
    })

    return () => {
      clearInterval(videoInterval)
      clearInterval(detectInterval)
    }
  }, [videoRef, canvasRef, detect, width, height, setGuideOpen, alertDialog])

  return (
    <>
      <Wrapper width={width} height={height}>
        <video ref={videoRef} width={width} height={height} autoPlay></video>
        <canvas ref={canvasRef} width={width} height={height}></canvas>
        <canvas
          className="layer"
          ref={layerRef}
          width={width}
          height={height}
        ></canvas>
      </Wrapper>
      <LayerPopup isOpen={guideOpen} width={550} onClose={onPopupClose}>
        <h1>카메라 권한 설정 안내</h1>
        <p>아래 안내에 따른 후, 가이드 창을 닫고 다시 시도하세요.</p>
        <ul>
          <li>1. 주소창 왼쪽의 🔒 혹은 ℹ️ 아이콘을 클릭합니다.</li>
          <li>
            2. 카메라 권한을 <strong>허용</strong>으로 변경합니다.
          </li>
          <li>3. 페이지를 새로고침하면 정상적으로 작동합니다.</li>
        </ul>
      </LayerPopup>
    </>
  )
}

export default React.memo(DetectObject)
