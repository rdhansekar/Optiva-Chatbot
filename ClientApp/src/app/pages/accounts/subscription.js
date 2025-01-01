import React from "react";

export default class Subscription extends React.Component {
    constructor() {
        super();
        setTimeout(() => {
            this.init();
        }, 500);
    }
    state = {
        packageType: 0,
        startUpAmount: 5,
        advanced: 7,
        enterPrise: 10,
        packageSelected: 1
    }
    init() {
        var d = document; var x = !d.getElementById('razorpay-embed-btn-js')
        if (x) {
            var s = d.createElement('script'); s.defer = !0; s.id = 'razorpay-embed-btn-js';
            s.src = 'https://cdn.razorpay.com/static/embed_btn/bundle.js'; d.body.appendChild(s);
        } else {
            var rzp = window['__rzp__'];
            rzp && rzp.init && rzp.init()
        }
    };

    packageChange(type) {
        var baseS = 5;
        var baseAdv = 7;
        var baseEnterprice = 10;
        switch (type) {
            case 0:
                break;
            case 1:
                baseS *= 11
                baseAdv *= 11
                baseEnterprice *= 11
                break;
        }
        this.setState({
            packageType: type,
            startUpAmount: baseS,
            advanced: baseAdv,
            enterPrise: baseEnterprice
        })
    }

    render() {
        return <div id="kt_app_content" class="app-content  flex-column-fluid ">
            <div id="kt_app_content_container" class="app-container  container-xxl ">
                <div class="card" id="kt_pricing">
                    <div class="card-body p-lg-17">
                        <div class="d-flex flex-column">
                            <div class="mb-13 text-center">
                                <h1 class="fs-2hx fw-bold mb-5">Choose Your Plan</h1>
                            </div>
                            <div class="nav-group nav-group-outline mx-auto mb-15" data-kt-buttons="true" data-kt-initialized="1">
                                <button onClick={() => { this.packageChange(0) }} className={"btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 " + (this.state.packageType == 0 ? 'active' : '')} data-kt-plan="month">
                                    Monthly
                                </button>
                                <button onClick={() => { this.packageChange(1) }} className={"btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 " + (this.state.packageType == 1 ? 'active' : '')} data-kt-plan="annual">
                                    Annual
                                </button>
                            </div>
                            <div class="row g-10">
                                <div className={"col-xl-4 hover-border " + (this.state.packageSelected === 0 ? 'package-selected' : '')}>
                                    <div class="d-flex h-100 align-items-center">
                                        <div class="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-15 px-10">
                                            <div class="mb-7 text-center">
                                                <h1 class="text-dark mb-5 fw-bolder">Startup</h1>
                                                <div class="text-gray-400 fw-semibold mb-5">
                                                    Optimal for 10+ team size<br /> and new startup
                                                </div>
                                                <div class="text-center">
                                                    <span class="fs-3x fw-bold text-primary" >{this.state.startUpAmount}</span>
                                                    <span class="mb-2 fs-3x text-primary">$</span>
                                                    <span class="fs-7 fw-semibold opacity-50">/
                                                        <span data-kt-element="period">Mon</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="w-100 mb-10">
                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Up to 10 Active Users</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Up to 30 Project Integrations</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Analytics Module</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                                <div class="d-flex align-items-center ">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        300MB Cloud Space</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-primary" onClick={() => { this.setState({ packageSelected: 0 }) }}>Select</button>
                                        </div>

                                    </div>
                                </div>
                                <div className={"col-xl-4 hover-border " + (this.state.packageSelected === 1 ? 'package-selected' : '')}>
                                    <div class="d-flex h-100 align-items-center">
                                        <div class="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-20 px-10">
                                            <div class="mb-7 text-center">
                                                <h1 class="text-dark mb-5 fw-bolder">Advanced</h1>

                                                <div class="text-gray-400 fw-semibold mb-5">
                                                    Optimal for 100+ team siz<br />e and grown company
                                                </div>
                                                <div class="text-center">
                                                    <span class="fs-3x fw-bold text-primary" >{this.state.advanced}</span>
                                                    <span class="mb-2 fs-3x text-primary">$</span>
                                                    <span class="fs-7 fw-semibold opacity-50">/
                                                        <span data-kt-element="period">Mon</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="w-100 mb-10">
                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Up to 300 Active Users</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Up to 50 Project Integrations</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Analytics Module</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                                <div class="d-flex align-items-center ">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        1GB Cloud Space</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>

                                            </div>
                                            <button class="btn btn-sm btn-primary" onClick={() => { this.setState({ packageSelected: 1 }) }}>Select</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-xl-4 hover-border " + (this.state.packageSelected === 2 ? 'package-selected' : '')}>
                                    <div class="d-flex h-100 align-items-center">
                                        <div class="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-15 px-10">
                                            <div class="mb-7 text-center">
                                                <h1 class="text-dark mb-5 fw-bolder">Enterprise</h1>

                                                <div class="text-gray-400 fw-semibold mb-5">
                                                    Optimal for 1000+ team<br /> and enterpise
                                                </div>
                                                <div class="text-center">
                                                <span class="fs-7 fw-semibold opacity-50">Starts from</span>
                                                <span class="fs-3x fw-bold text-primary" >{this.state.enterPrise}</span>
                                                    <span class="mb-2 fs-3x text-primary">$</span>

                                                    <span class="fs-7 fw-semibold opacity-50">/
                                                        <span data-kt-element="period">Mon</span>
                                                    </span> 
                                                </div>
                                            </div>
                                            <div class="w-100 mb-10">
                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Unlimited Active Users</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Up to 100 Project Integrations</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                                <div class="d-flex align-items-center mb-5">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Analytics Module</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                                <div class="d-flex align-items-center ">
                                                    <span class="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                                                        Unlimited Cloud Space</span>
                                                    <i class="ki-duotone ki-check-circle fs-1 text-success"><span class="path1"></span><span class="path2"></span></i>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-primary" onClick={() => { this.setState({ packageSelected: 2 }) }}>Contact Us</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-10">
                                <div className={"col-xl-12 "}>
                                    <div class="d-flex h-100 align-items-center">
                                        <div class="razorpay-embed-btn" data-url="https://pages.razorpay.com/pl_LdyPGq5XooVTvx/view" data-text="Pay Now" data-color="#528FF0" data-size="large">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    }
}