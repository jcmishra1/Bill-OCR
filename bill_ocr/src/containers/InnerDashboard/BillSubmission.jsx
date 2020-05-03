import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../config/config";
import Tesseract from "tesseract.js";

export default function BillSubmission() {
    const [billNumber, setBillNumber] = useState(null);
    const [billName, setBillName] = useState(null);
    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState(null);
    const [sentence, setSentence] = useState(null);
    const [percentage, setPercentage] = useState(0);

    // Tesseract handle
    const TesseractProcess = (file) => {
        Tesseract.recognize(file, "eng", {
            logger: (m) => {
                let n = m.progress * 100;
                console.log(m);
                if (m.status === "recognizing text")
                    setPercentage(n.toFixed(2));
                else setPercentage(1);
            },
        }).then(({ data: { text } }) => {
            setSentence(text);
            console.log(text);
        });
    };

    // Handle form
    const handleSubmit = async () => {
        let id = null;
        // form submission without img
        if (billName && billNumber && sentence) {
            const result = await axios.post(baseUrl + "create", {
                bill_no: billNumber,
                bill_name: billName,
                bill_raw_data: sentence,
            });
            console.log(result);
            id = result.data._id;
        } else console.log("pls fill some data");

        // form submission after ID generated by backend
        if (id) {
            let formData = new FormData();
            formData.append("file", file);
            const result = await axios.post(
                baseUrl + `upload/bill/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(result.statusText);
            if (result.statusText === "OK") {
                setBillNumber("");
                setBillName("");
                setPercentage(0);
                setSentence("");
                setFilePath("");
            }

            console.log(result);
        }
    };

    // returning
    return (
        <>
            {percentage === 0 ? null : (
                <div className="container-fluid mb-4">
                    <div className="progress my-8">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: percentage + "%" }}
                        >
                            <p style={{ margin: 0 }}>{percentage}%</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid">
                <h3 className="text-dark mb-4">Bill Submission</h3>
                <p className="text-primary m-0 font-weight-bold">Form&nbsp;</p>
                <div className="card shadow" />
            </div>

            <div className="container" style={{ paddingTop: 20 }}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group has-feedback">
                            <p className="text-primary m-0 font-weight-bold">
                                Bill Number&nbsp;
                            </p>
                            <input
                                className="form-control"
                                data-container=".row"
                                placeholder="Bill Number"
                                data-toggle="popover"
                                data-trigger="hover"
                                data-placement="right"
                                data-content="Must be at least 5 characters long, and must only contain letters."
                                type="number"
                                name="BillNumber"
                                value={billNumber}
                                onChange={(e) => setBillNumber(e.target.value)}
                            />
                        </div>
                        <div className="form-group has-feedback">
                            <p className="text-primary m-0 font-weight-bold">
                                Bill Name&nbsp;
                            </p>
                            <input
                                className="form-control"
                                data-container=".row"
                                placeholder="Bill Name"
                                data-toggle="popover"
                                data-trigger="hover"
                                data-placement="right"
                                data-content="Must be at least 5 characters long, and must only contain letters."
                                type="text"
                                name="BillName"
                                value={billName}
                                onChange={(e) => setBillName(e.target.value)}
                            />
                        </div>
                        {sentence && sentence.length > 0 ? (
                            <div className="form-group has-feedback">
                                <p className="text-primary m-0 font-weight-bold">
                                    Raw Data&nbsp;
                                </p>
                                <p
                                    className="form-control"
                                    style={{
                                        height: "auto",
                                        backgroundColor: "lightgrey",
                                        cursor: "not-allowed",
                                    }}
                                >
                                    {sentence}
                                </p>
                            </div>
                        ) : null}
                        <div
                            className="row justify-content-center"
                            style={{ paddingTop: 20 }}
                        >
                            <button
                                class="btn btn-primary btn-lg d-none d-sm-inline-block "
                                onClick={handleSubmit}
                                disabled={percentage < 100 ? true : false}
                            >
                                <i class="fas fa-upload fa-sm text-white-50"></i>
                                &nbsp;Submit
                            </button>
                        </div>
                    </div>

                    <div className="container col">
                        <div className="bootstrap_img_upload">
                            <div className="container py-5">
                                <div className="row">
                                    <div className="col mx-auto">
                                        {/* Upload image input*/}
                                        <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
                                            <input
                                                id="upload"
                                                type="file"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        console.log(
                                                            e.target.files[0]
                                                        );
                                                        setFile(
                                                            e.target.files[0]
                                                        );
                                                        setFilePath(
                                                            URL.createObjectURL(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        );
                                                        TesseractProcess(
                                                            e.target.files[0]
                                                        );
                                                        console.log(
                                                            URL.createObjectURL(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="form-control border-0"
                                            />
                                            <label
                                                id="upload-label"
                                                htmlFor="upload"
                                                className="font-weight-light text-muted"
                                            >
                                                Choose file
                                            </label>
                                            <div className="input-group-append">
                                                <label
                                                    htmlFor="upload"
                                                    className="btn btn-light m-0 rounded-pill px-4"
                                                >
                                                    {" "}
                                                    <i className="fa fa-cloud-upload mr-2 text-muted" />
                                                    <small className="text-uppercase font-weight-bold text-muted">
                                                        Choose file
                                                    </small>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Uploaded image area*/}

                                        <div className="image-area mt-4">
                                            <img
                                                id="imageResult"
                                                src={filePath}
                                                alt=""
                                                className="img-fluid rounded shadow-sm mx-auto d-block"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="row justify-content-center dis-sm-none"
                    style={{ paddingTop: 20 }}
                >
                    <button
                        class="btn btn-primary btn-lg "
                        onClick={handleSubmit}
                        disabled={percentage < 100 ? true : false}
                    >
                        <i class="fas fa-upload fa-sm text-white-50"></i>
                        &nbsp;Submit
                    </button>
                </div>
                <hr />
            </div>
        </>
    );
}
