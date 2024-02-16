import React from 'react'
import { whiteTheme } from '../../utils/globalVariables'
import toast from 'react-hot-toast'
import 'tui-color-picker/dist/tui-color-picker.css'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'

const CheckAnswerScript = ({
  singleResult,
  index,
  idx,
  photo,
  answer,
  source,
  setSource,
  setSendButtonEnabler,
  prevSource,
}) => {
  const imageEditor = React.createRef()

  const logImageContent = () => {
    const imageEditorInst = imageEditor.current.imageEditorInst
    const data = imageEditorInst.toDataURL()
    let bigImage = document.createElement('img')
    bigImage.src = data
    bigImage.onload = (e2) => {
      let canvas = document.createElement('canvas')
      let ratio = 600 / e2.target.width
      canvas.width = 600
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 100)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      // console.log(newImageUrl);
      setSource(prevSource)
      setSendButtonEnabler(false)
    }
    toast.success('Image Saved')
  }
  const checkNext = (i, j) => {
    // //console.log(source)
    const imageEditorInst = imageEditor.current.imageEditorInst
    const data = imageEditorInst.toDataURL()
    // //console.log('imageData: ', data)

    let bigImage = document.createElement('img')
    bigImage.src = data
    bigImage.onload = (e2) => {
      let canvas = document.createElement('canvas')
      let ratio = 600 / e2.target.width
      canvas.width = 600
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 100)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      // console.log(newImageUrl);
      setSource(prevSource)
    }

    toast.success('Image Saved')
  }
  return (
    <div>
      <div className="grid grid-cols-1 mt-4">
        <ImageEditor
          includeUI={{
            loadImage: {
              path: process.env.REACT_APP_API_HOST + '/' + photo,
              name: 'SampleImage',
            },
            menu: ['draw', 'rotate'],
            initMenu: 'draw',
            theme: whiteTheme,
            draw: {
              color: '#ff0000',
            },
            uiSize: {
              width: '100%',
              height: '942px',
            },
            menuBarPosition: 'bottom',
          }}
          cssMaxHeight={942}
          cssMaxWidth={414}
          selectionStyle={{
            cornerSize: 50,
            rotatingPointOffset: 100,
          }}
          usageStatistics={true}
          ref={imageEditor}
        />
      </div>

      <div>
        {index + 1 === answer.length ? (
          <button className="btn mt-4 justify-center" onClick={logImageContent}>
            Final Save
          </button>
        ) : (
          <button
            className="btn my-2 justify-center"
            onClick={() => checkNext(idx, index)}
          >
            Save This Image
          </button>
        )}
      </div>
    </div>
  )
}

export default CheckAnswerScript
