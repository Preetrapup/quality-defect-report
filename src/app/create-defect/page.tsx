'use client'

import { generateRandomString, getCurrentDateString } from "@/utils";
import "./defect.css";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { pushToList, updateList } from "@/redux/slices/defectReport";
import { setSavePhoto } from '@/redux/slices/defectReport';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { Button, Modal } from "react-bootstrap";
import jsQR from 'jsqr';

function CameraComponent({ onPhotoTaken }: any) {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  let mediaStream: any = null;

  const getVideoStream = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      onPhotoTaken(imageData); // Pass the image data to the callback function
    }
  };

  const closeCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track: any) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    getVideoStream();
    return () => {
      closeCamera();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} ></video>
      <Button onClick={takePhoto}>Take Photo</Button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

function DrawingComponent({ imageData, onSave }: any) {
  const canvasRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image: any = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
    };
    image.src = imageData;
  }, [imageData]);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const context = canvasRef.current.getContext('2d');
      context.closePath();
      setIsDrawing(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{ border: '2px solid black', cursor: 'crosshair', marginLeft: '10%' }}
      />
      <Button onClick={handleSave}>Save Part Photo</Button>
    </div>
  );
}

function CameraPopup({ show, handleClose, title }: any) {
  // use hooks
  const dispatch = useAppDispatch()

  // local states
  const [imageData, setImageData] = useState(null);

  const onPhotoTaken = (data: any) => {
    console.log(onPhotoTaken, "onPhotoTaken")
    setImageData(data);
  };

  const onSaveDrawing = (drawnData: any) => {
    dispatch(setSavePhoto(drawnData));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{imageData ? (
        <DrawingComponent imageData={imageData} onSave={onSaveDrawing} />
      ) : (
        <CameraComponent onPhotoTaken={onPhotoTaken} />
      )}</Modal.Body>
    </Modal>
  )
}


function CameraScanComponent({ onQRCodeScanned }: any) {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  let mediaStream: any = null;

  const getVideoStream = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          scanQRCode(); // Start scanning once the video is ready
        };
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };

  // const scanQRCode = () => {
  //   const video = videoRef.current;
  //   const canvas = canvasRef.current;
  //   if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
  //     const context = canvas.getContext('2d');
  //     // Set canvas size to video size
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     // Draw the video frame to the canvas
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //     // Try to scan the QR code
  //     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //     const code = jsQR(imageData.data, imageData.width, imageData.height, {
  //       inversionAttempts: 'dontInvert',
  //     });

  //     if (code) {
  //       onQRCodeScanned(code.data); // QR code is found
  //     } else {
  //       requestAnimationFrame(scanQRCode); // Continue scanning for QR code
  //     }
  //   } else {
  //     requestAnimationFrame(scanQRCode); // Video is not ready, try again
  //   }
  // };

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      console.log('Scanning...'); // Log scanning attempts

      if (code) {
        console.log('QR Code detected:', code.data); // If QR code is detected, log it
        onQRCodeScanned(code.data); // Pass the QR code data to the callback function
      } else {
        requestAnimationFrame(scanQRCode); // Keep scanning for QR codes
      }
    } else {
      requestAnimationFrame(scanQRCode); // Video is not ready, try again
    }
  };

  useEffect(() => {
    getVideoStream();
    // Cleanup function to stop the video when the component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(scanQRCode); // Start scanning for QR codes
  }, [mediaStream]); // Run this effect when the mediaStream is set

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

function CameraScanPopup({ show, handleClose, title, getQRScanCode }: any) {
  // use hooks
  // const dispatch = useAppDispatch()

  // // local states
  // const [imageData, setImageData] = useState(null);


  const onQRCodeScanned = (data: any) => {
    getQRScanCode(data);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body><CameraScanComponent onQRCodeScanned={onQRCodeScanned} /></Modal.Body>
    </Modal>
  )
}

function CreateDefect() {
  // use hooks 
  const dispatch = useAppDispatch()
  const router = useRouter()

  // global states
  const { list, defectEditDetail, savePhoto } = useAppSelector(state => state.defectReport)

  // local states
  const [formValues, setFormValues] = useState<any>({});
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [scanQRShow, setScanQRShow] = useState<boolean>(false);

  console.log(formValues, "formValues")

  // handling job id
  const getQRScanCode = (value: any) => {
    setFormValues((prev: any) => {
      return {
        ...prev,
        JobID: value,
      }
    })
  }

  // handling field value change
  const handleOnChange = (e: any) => {
    const { name, value } = e.target
    setFormValues((prev: any) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  // handling submit
  const handleSubmit = () => {
    const finalValues = { ...formValues, date: getCurrentDateString(), QDRNo: list?.length + 1, id: list?.length + 1 }
    if (defectEditDetail) {
      dispatch(updateList(finalValues));
    } else {
      dispatch(pushToList(finalValues));
    }
    router.push('/');
  }

  // setting initial values
  useLayoutEffect(() => {
    setFormValues(defectEditDetail ?? {});

    // return () => {
    //   dispatch(setDefectEditDetail(null));
    // }
  }, [dispatch, defectEditDetail])

  // handling clicked images
  useEffect(() => {
    if (savePhoto) {
      setFormValues((prev: any) => {
        const newPartImages = prev?.partImages ? [...prev?.partImages, savePhoto] : [savePhoto]
        return {
          ...prev,
          partImages: newPartImages
        }
      });
      dispatch(setSavePhoto(null));
    }
  }, [dispatch, savePhoto]);

  return (
    <>
      <div className="quality-defect-report">
        <div className="report-header" style={{ margin: 20, padding: 20 }}>
          <h1 className="title">QUALITY DEFECT REPORT</h1>
          <div className="date-time">{getCurrentDateString()}</div>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label htmlFor="partNumber">Part Number (P/N)</label>
            <input type="text" id="partNumber" name="pn" value={formValues?.pn} onChange={handleOnChange} placeholder="Enter Part Number" />
          </div>
          <div className="input-group">
            <label htmlFor="jobID">Job ID</label>
            <input type="text" disabled id="jobID" name="JobID" value={formValues?.JobID} placeholder="Enter Job ID" />
            <button type="button" onClick={() => setScanQRShow(true)} >Scan</button>
          </div>
          <div className="input-group">
            <label htmlFor="partDescription">Part Description</label>
            <input type="text" id="partDescription" name="partDescription" value={formValues?.partDescription} onChange={handleOnChange} placeholder="Enter Part Description" />
          </div>
          <div className="input-group">
            <label htmlFor="customerName">Customer Name</label>
            <input type="text" id="customerName" name="customerName" value={formValues?.customerName} onChange={handleOnChange} placeholder="Enter Customer Name" />
          </div>
          <div className="input-group">
            <label htmlFor="serialNumber">Serial No. (S/N)</label>
            <input type="text" id="serialNumber" name="sn" value={formValues?.sn} onChange={handleOnChange} placeholder="Enter Serial Number" />
          </div>
          <div className="input-group">
            <label htmlFor="customerPO">Customer Purchase Order. (PO No)</label>
            <input type="text" id="customerPO" name="cpo" value={formValues?.cpo} onChange={handleOnChange} placeholder="Enter Customer PO" />
          </div>
          <div className="input-group full">
            <label htmlFor="problemStatement">Problem Statement</label>
            <textarea id="problemStatement" name="problemStatement" value={formValues?.problemStatement} onChange={handleOnChange} placeholder="Describe the problem statement"></textarea>
          </div>
          <div className="input-group full">
            <label htmlFor="problemDescription">Problem Description</label>
            <textarea id="problemDescription" name="problemDescription" value={formValues?.problemDescription} onChange={handleOnChange} placeholder="Describe the problem in detail"></textarea>
          </div>
        </div>

        <div className="images-section">
          <div className="image-upload-container">
            {
              formValues?.partImages?.length ?
                formValues?.partImages?.map((item: any, ind: any) => {
                  return (
                    <div className="image-upload" key={ind}>
                      <img src={item} alt={`Snapshot`} height='100%' width="100%" />
                      <div className="image-placeholder"></div>
                    </div>
                  )
                }) : <div className="image-upload">
                  <label style={{ marginLeft: '30%' }} >Click to capture the image</label>
                  <div className="image-placeholder"></div>
                </div>
            }
            {/* <!-- Repeat the above div for the number of images you need to upload --> */}
            <button type="button" onClick={() => setShowCamera(true)} className="add-image-btn">+</button>
          </div>
        </div>

        <div className="footer">
          <button type="button" onClick={handleSubmit} >Submit</button>
          {/* <div>For operator</div> */}
        </div>
      </div >
      {
        showCamera && <CameraPopup show={showCamera} handleClose={() => setShowCamera(false)} title="Take Part Photo" />
      }
      {
        scanQRShow && <CameraScanPopup show={scanQRShow} handleClose={() => setScanQRShow(false)} title="Scan QR" getQRScanCode={getQRScanCode} />
      }
    </>
  )
}

export default CreateDefect;



