import React, { Component } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { getAccountsettings, getBranding } from "../../service/utility";

class Sidebar extends Component {
  state = {
    menuList: [
      {
        icon: "bi bi-bar-chart-line-fill",
        path: "/home/business",
        title: "Business Dashboard",
      },
      {
        icon: "bi bi-bar-chart-line-fill",
        path: "/home/dashboard",
        title: "Dashboard",
      },
     
      {
        icon: "bi bi-list-task",
        path: "/home/tasklist",
        title: "Tasks",
      },
      {
        icon: "bi bi-bullseye",
        path: "/home/okr",
        title: "OKR",
      },
      {
        icon: "bi bi-file-earmark-bar-graph",
        path: "/home/reports",
        title: "Reports",
      },
      {
        icon: "bi bi-app-indicator",
        path: "/home/projects",
        title: "Projects",
      },
    ],
    settingsList: [
      {
        icon: "bi bi-gear-wide",
        path: "/home/accountsettings",
        title: "Account Settings",
      },
      {
        icon: "bi bi-person-rolodex",
        path: "/home/userManagement",
        title: "User Management",
      },
      {
        icon: "bi bi-person-lines-fill",
        path: "/home/profile",
        title: "Profile Settings",
      },
    ],
  };

  toggleSidebar() {
    if (window.innerWidth > 680) {
      document.querySelector("body").classList.toggle("min_sidebar");
    } else {
      document.querySelector("body").classList.toggle("no_sidebar");
    }
  }

  

  onLinkClick(path,title) {
    this.setState({ activePath: path });
    this.props.navChange(title);
  }

  init() {
    var getSettings = getAccountsettings();
    if (!getSettings) {
      setTimeout(() => {
        this.init();
      }, 2000);
    } else {
      var branding = getBranding();
      this.setState({
        FirstName: getSettings.fName,
        MailId: getSettings.userid,
        AccountId: getSettings.tenant_id,
        BrandLogo: branding.brandLogo,
        BrandTitle: branding.brandTitle,
      });
    }
  }

  componentDidMount() {
    this.init();
    this.setActivePath();
  }

  setActivePath() {
    var activePath =  window.location.pathname.toLowerCase();
    var index = this.state.menuList.map((item)=>{return item.path.toLowerCase()}).indexOf(activePath);
    var title = "";
    if(index !== -1){
        title = "Home > " + this.state.menuList[index]["title"];
    }
    else{
         index = this.state.settingsList.map((item)=>{return item.path.toLowerCase()}).indexOf(activePath); 
         if(index !== -1){
            title = "Settings > " + this.state.settingsList[index]["title"];
         }
    }
    this.setState({activePath:activePath})
    this.props.navChange(title);
  }

  render() {
    var brandIcon = require("../../../src/icon.png");
    var title = "Optiva";
    if (this.state.BrandLogo) {
      brandIcon = this.state.BrandLogo;
    }
    if (this.state.BrandTitle) {
      title = this.state.BrandTitle;
    }
    
    var menuList = this.state.menuList.map((item) => {
      if (item.children) {
        var menuChild = item.children.map((child) => {
          return (
            <div className={ this.state.activePath === item.path? "menu-sub menu-sub-accordion active": "menu-sub menu-sub-accordion" }
               onClick={() => {this.onLinkClick(item.path, "Home > " + item.title);}}>
            {/*begin:Menu item*/}
            <div class="menu-item">
                {/*begin:Menu link*/}
                <Link className="menu-link active" to={child.path}>
                <span class="menu-bullet">
                <span class="bullet bullet-dot"></span>
                 </span>
                <span class="menu-title">{child.title}</span>
                 </Link>
            
                {/*end:Menu link*/}
            </div>
            {/*end:Menu item*/}
           </div>
          );
        });
      }
      return (
              <div data-kt-menu-trigger="click" className={ this.state.activePath === item.path ? "menu-item here show menu-accordion active" : "menu-item here show menu-accordion"}
              onClick={() => {this.onLinkClick(item.path, "Home > " + item.title); }}>
              <div class="menu-item">
                  {/*begin:Menu link*/}
                  <Link class="menu-link active" to={item.path}>
                      <span class="menu-bullet">
                          <span class="bullet bullet-dot"  data-toggle="tooltip" data-placement="right" title={item.icon}>
                          <i class={item.icon}></i>
                          </span>
                      </span>
                      <span class="menu-title">{item.title}</span>
                  </Link>
                  {/*end:Menu link*/}
                  {menuChild}
              </div>
              </div>
            );
    });
    var settingsList = this.state.settingsList.map((item) => {
      return (
        <li
          onClick={() => {
            this.onLinkClick(item.path, "Settings > "+ item.title);
          }}
          className={
           this.state.activePath === item.path
              ? "nav-item active"
              : "nav-item"
          }
        >
          <Link class="nav-link" to={item.path}>
            <span
              class="nav-icon"
              data-toggle="tooltip"
              data-placement="right"
              title={item.icon}
            >
              {" "}
              <i class={item.icon}></i>
            </span>
            <span class="nav-title">{item.title}</span>
          </Link>
        </li>
      );
    });
    return (
        <div id="kt_app_sidebar" class="app-sidebar flex-column" data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
        {/*begin::Header*/}
        <div class="app-sidebar-header d-flex flex-column px-10 pt-8" id="kt_app_sidebar_header">
            {/*begin::Brand*/}
            <div class="d-flex flex-stack mb-10">
                {/*begin::User*/}
                <div class="">
                    {/*begin::User info*/}
                    <div class="d-flex align-items-center" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-overflow="true" data-kt-menu-placement="top-start">
                        <div class="d-flex flex-center cursor-pointer symbol symbol-custom symbol-40px">
                            <img src={brandIcon} alt="image" />
                        </div>
                        {/*begin::Username*/}
                        <a href="#" class="text-white text-hover-primary fs-4 fw-bold ms-3">Eugenia</a>
                        {/*end::Username*/}
                    </div>
                    {/*end::User info*/}
                    {/*begin::User account menu*/}
                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px" data-kt-menu="true">
                        {/*begin::Menu item*/}
                        <div class="menu-item px-3">
                            <div class="menu-content d-flex align-items-center px-3">
                                {/*begin::Avatar*/}
                                <div class="symbol symbol-50px me-5">
                                    <img alt="Logo"  src={brandIcon} />
                                </div>
                                {/*end::Avatar*/}
                                {/*begin::Username*/}
                                <div class="d-flex flex-column">
                                    <div class="fw-bold d-flex align-items-center fs-5">Eugenia
                                    <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Pro</span></div>
                                    <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">eugenia@kt.com</a>
                                </div>
                                {/*end::Username*/}
                            </div>
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu separator*/}
                        <div class="separator my-2"></div>
                        {/*end::Menu separator*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5">
                            <a href="../../demo36/dist/account/overview.html" class="menu-link px-5">My Profile</a>
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5">
                            <a href="../../demo36/dist/apps/projects/list.html" class="menu-link px-5">
                                <span class="menu-text">My Projects</span>
                                <span class="menu-badge">
                                    <span class="badge badge-light-danger badge-circle fw-bold fs-7">3</span>
                                </span>
                            </a>
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="right-end" data-kt-menu-offset="-15px, 0">
                            <a href="#" class="menu-link px-5">
                                <span class="menu-title">My Subscription</span>
                                <span class="menu-arrow"></span>
                            </a>
                            {/*begin::Menu sub*/}
                            <div class="menu-sub menu-sub-dropdown w-175px py-4">
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/referrals.html" class="menu-link px-5">Referrals</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/billing.html" class="menu-link px-5">Billing</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/statements.html" class="menu-link px-5">Payments</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/statements.html" class="menu-link d-flex flex-stack px-5">Statements
                                    <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="View your statements"></i></a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu separator*/}
                                <div class="separator my-2"></div>
                                {/*end::Menu separator*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <div class="menu-content px-3">
                                        <label class="form-check form-switch form-check-custom form-check-solid">
                                            <input class="form-check-input w-30px h-20px" type="checkbox" value="1" checked="checked" name="notifications" />
                                            <span class="form-check-label text-muted fs-7">Notifications</span>
                                        </label>
                                    </div>
                                </div>
                                {/*end::Menu item*/}
                            </div>
                            {/*end::Menu sub*/}
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5">
                            <a href="../../demo36/dist/account/statements.html" class="menu-link px-5">My Statements</a>
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu separator*/}
                        <div class="separator my-2"></div>
                        {/*end::Menu separator*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="left-start" data-kt-menu-offset="-15px, 0">
                            <a href="#" class="menu-link px-5">
                                <span class="menu-title position-relative">Mode
                                <span class="ms-5 position-absolute translate-middle-y top-50 end-0">
                                    {/*begin::Svg Icon | path: icons/duotune/general/gen060.svg*/}
                                    <span class="svg-icon theme-light-show svg-icon-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.9905 5.62598C10.7293 5.62574 9.49646 5.9995 8.44775 6.69997C7.39903 7.40045 6.58159 8.39619 6.09881 9.56126C5.61603 10.7263 5.48958 12.0084 5.73547 13.2453C5.98135 14.4823 6.58852 15.6185 7.48019 16.5104C8.37186 17.4022 9.50798 18.0096 10.7449 18.2557C11.9818 18.5019 13.2639 18.3757 14.429 17.8931C15.5942 17.4106 16.5901 16.5933 17.2908 15.5448C17.9915 14.4962 18.3655 13.2634 18.3655 12.0023C18.3637 10.3119 17.6916 8.69129 16.4964 7.49593C15.3013 6.30056 13.6808 5.62806 11.9905 5.62598Z" fill="currentColor" />
                                            <path d="M22.1258 10.8771H20.627C20.3286 10.8771 20.0424 10.9956 19.8314 11.2066C19.6204 11.4176 19.5018 11.7038 19.5018 12.0023C19.5018 12.3007 19.6204 12.5869 19.8314 12.7979C20.0424 13.0089 20.3286 13.1274 20.627 13.1274H22.1258C22.4242 13.1274 22.7104 13.0089 22.9214 12.7979C23.1324 12.5869 23.2509 12.3007 23.2509 12.0023C23.2509 11.7038 23.1324 11.4176 22.9214 11.2066C22.7104 10.9956 22.4242 10.8771 22.1258 10.8771Z" fill="currentColor" />
                                            <path d="M11.9905 19.4995C11.6923 19.5 11.4064 19.6187 11.1956 19.8296C10.9848 20.0405 10.8663 20.3265 10.866 20.6247V22.1249C10.866 22.4231 10.9845 22.7091 11.1953 22.9199C11.4062 23.1308 11.6922 23.2492 11.9904 23.2492C12.2886 23.2492 12.5746 23.1308 12.7854 22.9199C12.9963 22.7091 13.1147 22.4231 13.1147 22.1249V20.6247C13.1145 20.3265 12.996 20.0406 12.7853 19.8296C12.5745 19.6187 12.2887 19.5 11.9905 19.4995Z" fill="currentColor" />
                                            <path d="M4.49743 12.0023C4.49718 11.704 4.37865 11.4181 4.16785 11.2072C3.95705 10.9962 3.67119 10.8775 3.37298 10.8771H1.87445C1.57603 10.8771 1.28984 10.9956 1.07883 11.2066C0.867812 11.4176 0.749266 11.7038 0.749266 12.0023C0.749266 12.3007 0.867812 12.5869 1.07883 12.7979C1.28984 13.0089 1.57603 13.1274 1.87445 13.1274H3.37299C3.6712 13.127 3.95706 13.0083 4.16785 12.7973C4.37865 12.5864 4.49718 12.3005 4.49743 12.0023Z" fill="currentColor" />
                                            <path d="M11.9905 4.50058C12.2887 4.50012 12.5745 4.38141 12.7853 4.17048C12.9961 3.95954 13.1147 3.67361 13.1149 3.3754V1.87521C13.1149 1.57701 12.9965 1.29103 12.7856 1.08017C12.5748 0.869313 12.2888 0.750854 11.9906 0.750854C11.6924 0.750854 11.4064 0.869313 11.1955 1.08017C10.9847 1.29103 10.8662 1.57701 10.8662 1.87521V3.3754C10.8664 3.67359 10.9849 3.95952 11.1957 4.17046C11.4065 4.3814 11.6923 4.50012 11.9905 4.50058Z" fill="currentColor" />
                                            <path d="M18.8857 6.6972L19.9465 5.63642C20.0512 5.53209 20.1343 5.40813 20.1911 5.27163C20.2479 5.13513 20.2772 4.98877 20.2774 4.84093C20.2775 4.69309 20.2485 4.54667 20.192 4.41006C20.1355 4.27344 20.0526 4.14932 19.948 4.04478C19.8435 3.94024 19.7194 3.85734 19.5828 3.80083C19.4462 3.74432 19.2997 3.71531 19.1519 3.71545C19.0041 3.7156 18.8577 3.7449 18.7212 3.80167C18.5847 3.85845 18.4607 3.94159 18.3564 4.04633L17.2956 5.10714C17.1909 5.21147 17.1077 5.33543 17.0509 5.47194C16.9942 5.60844 16.9649 5.7548 16.9647 5.90264C16.9646 6.05048 16.9936 6.19689 17.0501 6.33351C17.1066 6.47012 17.1895 6.59425 17.294 6.69878C17.3986 6.80332 17.5227 6.88621 17.6593 6.94272C17.7959 6.99923 17.9424 7.02824 18.0902 7.02809C18.238 7.02795 18.3844 6.99865 18.5209 6.94187C18.6574 6.88509 18.7814 6.80195 18.8857 6.6972Z" fill="currentColor" />
                                            <path d="M18.8855 17.3073C18.7812 17.2026 18.6572 17.1195 18.5207 17.0627C18.3843 17.006 18.2379 16.9767 18.0901 16.9766C17.9423 16.9764 17.7959 17.0055 17.6593 17.062C17.5227 17.1185 17.3986 17.2014 17.2941 17.3059C17.1895 17.4104 17.1067 17.5345 17.0501 17.6711C16.9936 17.8077 16.9646 17.9541 16.9648 18.1019C16.9649 18.2497 16.9942 18.3961 17.0509 18.5326C17.1077 18.6691 17.1908 18.793 17.2955 18.8974L18.3563 19.9582C18.4606 20.0629 18.5846 20.146 18.721 20.2027C18.8575 20.2595 19.0039 20.2887 19.1517 20.2889C19.2995 20.289 19.4459 20.26 19.5825 20.2035C19.7191 20.147 19.8432 20.0641 19.9477 19.9595C20.0523 19.855 20.1351 19.7309 20.1916 19.5943C20.2482 19.4577 20.2772 19.3113 20.277 19.1635C20.2769 19.0157 20.2476 18.8694 20.1909 18.7329C20.1341 18.5964 20.051 18.4724 19.9463 18.3681L18.8855 17.3073Z" fill="currentColor" />
                                            <path d="M5.09528 17.3072L4.0345 18.368C3.92972 18.4723 3.84655 18.5963 3.78974 18.7328C3.73294 18.8693 3.70362 19.0156 3.70346 19.1635C3.7033 19.3114 3.7323 19.4578 3.78881 19.5944C3.84532 19.7311 3.92822 19.8552 4.03277 19.9598C4.13732 20.0643 4.26147 20.1472 4.3981 20.2037C4.53473 20.2602 4.68117 20.2892 4.82902 20.2891C4.97688 20.2889 5.12325 20.2596 5.25976 20.2028C5.39627 20.146 5.52024 20.0628 5.62456 19.958L6.68536 18.8973C6.79007 18.7929 6.87318 18.6689 6.92993 18.5325C6.98667 18.396 7.01595 18.2496 7.01608 18.1018C7.01621 17.954 6.98719 17.8076 6.93068 17.671C6.87417 17.5344 6.79129 17.4103 6.68676 17.3058C6.58224 17.2012 6.45813 17.1183 6.32153 17.0618C6.18494 17.0053 6.03855 16.9763 5.89073 16.9764C5.74291 16.9766 5.59657 17.0058 5.46007 17.0626C5.32358 17.1193 5.19962 17.2024 5.09528 17.3072Z" fill="currentColor" />
                                            <path d="M5.09541 6.69715C5.19979 6.8017 5.32374 6.88466 5.4602 6.94128C5.59665 6.9979 5.74292 7.02708 5.89065 7.02714C6.03839 7.0272 6.18469 6.99815 6.32119 6.94164C6.45769 6.88514 6.58171 6.80228 6.68618 6.69782C6.79064 6.59336 6.87349 6.46933 6.93 6.33283C6.9865 6.19633 7.01556 6.05003 7.01549 5.9023C7.01543 5.75457 6.98625 5.60829 6.92963 5.47184C6.87301 5.33539 6.79005 5.21143 6.6855 5.10706L5.6247 4.04626C5.5204 3.94137 5.39643 3.8581 5.25989 3.80121C5.12335 3.74432 4.97692 3.71493 4.82901 3.71472C4.68109 3.71452 4.53458 3.7435 4.39789 3.80001C4.26119 3.85652 4.13699 3.93945 4.03239 4.04404C3.9278 4.14864 3.84487 4.27284 3.78836 4.40954C3.73185 4.54624 3.70287 4.69274 3.70308 4.84066C3.70329 4.98858 3.73268 5.135 3.78957 5.27154C3.84646 5.40808 3.92974 5.53205 4.03462 5.63635L5.09541 6.69715Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                    {/*end::Svg Icon*/}
                                    {/*begin::Svg Icon | path: icons/duotune/general/gen061.svg*/}
                                    <span class="svg-icon theme-dark-show svg-icon-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.0647 5.43757C19.3421 5.43757 19.567 5.21271 19.567 4.93534C19.567 4.65796 19.3421 4.43311 19.0647 4.43311C18.7874 4.43311 18.5625 4.65796 18.5625 4.93534C18.5625 5.21271 18.7874 5.43757 19.0647 5.43757Z" fill="currentColor" />
                                            <path d="M20.0692 9.48884C20.3466 9.48884 20.5714 9.26398 20.5714 8.98661C20.5714 8.70923 20.3466 8.48438 20.0692 8.48438C19.7918 8.48438 19.567 8.70923 19.567 8.98661C19.567 9.26398 19.7918 9.48884 20.0692 9.48884Z" fill="currentColor" />
                                            <path d="M12.0335 20.5714C15.6943 20.5714 18.9426 18.2053 20.1168 14.7338C20.1884 14.5225 20.1114 14.289 19.9284 14.161C19.746 14.034 19.5003 14.0418 19.3257 14.1821C18.2432 15.0546 16.9371 15.5156 15.5491 15.5156C12.2257 15.5156 9.48884 12.8122 9.48884 9.48886C9.48884 7.41079 10.5773 5.47137 12.3449 4.35752C12.5342 4.23832 12.6 4.00733 12.5377 3.79251C12.4759 3.57768 12.2571 3.42859 12.0335 3.42859C7.32556 3.42859 3.42857 7.29209 3.42857 12C3.42857 16.7079 7.32556 20.5714 12.0335 20.5714Z" fill="currentColor" />
                                            <path d="M13.0379 7.47998C13.8688 7.47998 14.5446 8.15585 14.5446 8.98668C14.5446 9.26428 14.7693 9.48891 15.0469 9.48891C15.3245 9.48891 15.5491 9.26428 15.5491 8.98668C15.5491 8.15585 16.225 7.47998 17.0558 7.47998C17.3334 7.47998 17.558 7.25535 17.558 6.97775C17.558 6.70015 17.3334 6.47552 17.0558 6.47552C16.225 6.47552 15.5491 5.76616 15.5491 4.93534C15.5491 4.65774 15.3245 4.43311 15.0469 4.43311C14.7693 4.43311 14.5446 4.65774 14.5446 4.93534C14.5446 5.76616 13.8688 6.47552 13.0379 6.47552C12.7603 6.47552 12.5357 6.70015 12.5357 6.97775C12.5357 7.25535 12.7603 7.47998 13.0379 7.47998Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                    {/*end::Svg Icon*/}
                                </span></span>
                            </a>
                            {/*begin::Menu*/}
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3 my-0">
                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="light">
                                        <span class="menu-icon" data-kt-element="icon">
                                            {/*begin::Svg Icon | path: icons/duotune/general/gen060.svg*/}
                                            <span class="svg-icon svg-icon-3">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9905 5.62598C10.7293 5.62574 9.49646 5.9995 8.44775 6.69997C7.39903 7.40045 6.58159 8.39619 6.09881 9.56126C5.61603 10.7263 5.48958 12.0084 5.73547 13.2453C5.98135 14.4823 6.58852 15.6185 7.48019 16.5104C8.37186 17.4022 9.50798 18.0096 10.7449 18.2557C11.9818 18.5019 13.2639 18.3757 14.429 17.8931C15.5942 17.4106 16.5901 16.5933 17.2908 15.5448C17.9915 14.4962 18.3655 13.2634 18.3655 12.0023C18.3637 10.3119 17.6916 8.69129 16.4964 7.49593C15.3013 6.30056 13.6808 5.62806 11.9905 5.62598Z" fill="currentColor" />
                                                    <path d="M22.1258 10.8771H20.627C20.3286 10.8771 20.0424 10.9956 19.8314 11.2066C19.6204 11.4176 19.5018 11.7038 19.5018 12.0023C19.5018 12.3007 19.6204 12.5869 19.8314 12.7979C20.0424 13.0089 20.3286 13.1274 20.627 13.1274H22.1258C22.4242 13.1274 22.7104 13.0089 22.9214 12.7979C23.1324 12.5869 23.2509 12.3007 23.2509 12.0023C23.2509 11.7038 23.1324 11.4176 22.9214 11.2066C22.7104 10.9956 22.4242 10.8771 22.1258 10.8771Z" fill="currentColor" />
                                                    <path d="M11.9905 19.4995C11.6923 19.5 11.4064 19.6187 11.1956 19.8296C10.9848 20.0405 10.8663 20.3265 10.866 20.6247V22.1249C10.866 22.4231 10.9845 22.7091 11.1953 22.9199C11.4062 23.1308 11.6922 23.2492 11.9904 23.2492C12.2886 23.2492 12.5746 23.1308 12.7854 22.9199C12.9963 22.7091 13.1147 22.4231 13.1147 22.1249V20.6247C13.1145 20.3265 12.996 20.0406 12.7853 19.8296C12.5745 19.6187 12.2887 19.5 11.9905 19.4995Z" fill="currentColor" />
                                                    <path d="M4.49743 12.0023C4.49718 11.704 4.37865 11.4181 4.16785 11.2072C3.95705 10.9962 3.67119 10.8775 3.37298 10.8771H1.87445C1.57603 10.8771 1.28984 10.9956 1.07883 11.2066C0.867812 11.4176 0.749266 11.7038 0.749266 12.0023C0.749266 12.3007 0.867812 12.5869 1.07883 12.7979C1.28984 13.0089 1.57603 13.1274 1.87445 13.1274H3.37299C3.6712 13.127 3.95706 13.0083 4.16785 12.7973C4.37865 12.5864 4.49718 12.3005 4.49743 12.0023Z" fill="currentColor" />
                                                    <path d="M11.9905 4.50058C12.2887 4.50012 12.5745 4.38141 12.7853 4.17048C12.9961 3.95954 13.1147 3.67361 13.1149 3.3754V1.87521C13.1149 1.57701 12.9965 1.29103 12.7856 1.08017C12.5748 0.869313 12.2888 0.750854 11.9906 0.750854C11.6924 0.750854 11.4064 0.869313 11.1955 1.08017C10.9847 1.29103 10.8662 1.57701 10.8662 1.87521V3.3754C10.8664 3.67359 10.9849 3.95952 11.1957 4.17046C11.4065 4.3814 11.6923 4.50012 11.9905 4.50058Z" fill="currentColor" />
                                                    <path d="M18.8857 6.6972L19.9465 5.63642C20.0512 5.53209 20.1343 5.40813 20.1911 5.27163C20.2479 5.13513 20.2772 4.98877 20.2774 4.84093C20.2775 4.69309 20.2485 4.54667 20.192 4.41006C20.1355 4.27344 20.0526 4.14932 19.948 4.04478C19.8435 3.94024 19.7194 3.85734 19.5828 3.80083C19.4462 3.74432 19.2997 3.71531 19.1519 3.71545C19.0041 3.7156 18.8577 3.7449 18.7212 3.80167C18.5847 3.85845 18.4607 3.94159 18.3564 4.04633L17.2956 5.10714C17.1909 5.21147 17.1077 5.33543 17.0509 5.47194C16.9942 5.60844 16.9649 5.7548 16.9647 5.90264C16.9646 6.05048 16.9936 6.19689 17.0501 6.33351C17.1066 6.47012 17.1895 6.59425 17.294 6.69878C17.3986 6.80332 17.5227 6.88621 17.6593 6.94272C17.7959 6.99923 17.9424 7.02824 18.0902 7.02809C18.238 7.02795 18.3844 6.99865 18.5209 6.94187C18.6574 6.88509 18.7814 6.80195 18.8857 6.6972Z" fill="currentColor" />
                                                    <path d="M18.8855 17.3073C18.7812 17.2026 18.6572 17.1195 18.5207 17.0627C18.3843 17.006 18.2379 16.9767 18.0901 16.9766C17.9423 16.9764 17.7959 17.0055 17.6593 17.062C17.5227 17.1185 17.3986 17.2014 17.2941 17.3059C17.1895 17.4104 17.1067 17.5345 17.0501 17.6711C16.9936 17.8077 16.9646 17.9541 16.9648 18.1019C16.9649 18.2497 16.9942 18.3961 17.0509 18.5326C17.1077 18.6691 17.1908 18.793 17.2955 18.8974L18.3563 19.9582C18.4606 20.0629 18.5846 20.146 18.721 20.2027C18.8575 20.2595 19.0039 20.2887 19.1517 20.2889C19.2995 20.289 19.4459 20.26 19.5825 20.2035C19.7191 20.147 19.8432 20.0641 19.9477 19.9595C20.0523 19.855 20.1351 19.7309 20.1916 19.5943C20.2482 19.4577 20.2772 19.3113 20.277 19.1635C20.2769 19.0157 20.2476 18.8694 20.1909 18.7329C20.1341 18.5964 20.051 18.4724 19.9463 18.3681L18.8855 17.3073Z" fill="currentColor" />
                                                    <path d="M5.09528 17.3072L4.0345 18.368C3.92972 18.4723 3.84655 18.5963 3.78974 18.7328C3.73294 18.8693 3.70362 19.0156 3.70346 19.1635C3.7033 19.3114 3.7323 19.4578 3.78881 19.5944C3.84532 19.7311 3.92822 19.8552 4.03277 19.9598C4.13732 20.0643 4.26147 20.1472 4.3981 20.2037C4.53473 20.2602 4.68117 20.2892 4.82902 20.2891C4.97688 20.2889 5.12325 20.2596 5.25976 20.2028C5.39627 20.146 5.52024 20.0628 5.62456 19.958L6.68536 18.8973C6.79007 18.7929 6.87318 18.6689 6.92993 18.5325C6.98667 18.396 7.01595 18.2496 7.01608 18.1018C7.01621 17.954 6.98719 17.8076 6.93068 17.671C6.87417 17.5344 6.79129 17.4103 6.68676 17.3058C6.58224 17.2012 6.45813 17.1183 6.32153 17.0618C6.18494 17.0053 6.03855 16.9763 5.89073 16.9764C5.74291 16.9766 5.59657 17.0058 5.46007 17.0626C5.32358 17.1193 5.19962 17.2024 5.09528 17.3072Z" fill="currentColor" />
                                                    <path d="M5.09541 6.69715C5.19979 6.8017 5.32374 6.88466 5.4602 6.94128C5.59665 6.9979 5.74292 7.02708 5.89065 7.02714C6.03839 7.0272 6.18469 6.99815 6.32119 6.94164C6.45769 6.88514 6.58171 6.80228 6.68618 6.69782C6.79064 6.59336 6.87349 6.46933 6.93 6.33283C6.9865 6.19633 7.01556 6.05003 7.01549 5.9023C7.01543 5.75457 6.98625 5.60829 6.92963 5.47184C6.87301 5.33539 6.79005 5.21143 6.6855 5.10706L5.6247 4.04626C5.5204 3.94137 5.39643 3.8581 5.25989 3.80121C5.12335 3.74432 4.97692 3.71493 4.82901 3.71472C4.68109 3.71452 4.53458 3.7435 4.39789 3.80001C4.26119 3.85652 4.13699 3.93945 4.03239 4.04404C3.9278 4.14864 3.84487 4.27284 3.78836 4.40954C3.73185 4.54624 3.70287 4.69274 3.70308 4.84066C3.70329 4.98858 3.73268 5.135 3.78957 5.27154C3.84646 5.40808 3.92974 5.53205 4.03462 5.63635L5.09541 6.69715Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                        <span class="menu-title">Light</span>
                                    </a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3 my-0">
                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="dark">
                                        <span class="menu-icon" data-kt-element="icon">
                                            {/*begin::Svg Icon | path: icons/duotune/general/gen061.svg*/}
                                            <span class="svg-icon svg-icon-3">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.0647 5.43757C19.3421 5.43757 19.567 5.21271 19.567 4.93534C19.567 4.65796 19.3421 4.43311 19.0647 4.43311C18.7874 4.43311 18.5625 4.65796 18.5625 4.93534C18.5625 5.21271 18.7874 5.43757 19.0647 5.43757Z" fill="currentColor" />
                                                    <path d="M20.0692 9.48884C20.3466 9.48884 20.5714 9.26398 20.5714 8.98661C20.5714 8.70923 20.3466 8.48438 20.0692 8.48438C19.7918 8.48438 19.567 8.70923 19.567 8.98661C19.567 9.26398 19.7918 9.48884 20.0692 9.48884Z" fill="currentColor" />
                                                    <path d="M12.0335 20.5714C15.6943 20.5714 18.9426 18.2053 20.1168 14.7338C20.1884 14.5225 20.1114 14.289 19.9284 14.161C19.746 14.034 19.5003 14.0418 19.3257 14.1821C18.2432 15.0546 16.9371 15.5156 15.5491 15.5156C12.2257 15.5156 9.48884 12.8122 9.48884 9.48886C9.48884 7.41079 10.5773 5.47137 12.3449 4.35752C12.5342 4.23832 12.6 4.00733 12.5377 3.79251C12.4759 3.57768 12.2571 3.42859 12.0335 3.42859C7.32556 3.42859 3.42857 7.29209 3.42857 12C3.42857 16.7079 7.32556 20.5714 12.0335 20.5714Z" fill="currentColor" />
                                                    <path d="M13.0379 7.47998C13.8688 7.47998 14.5446 8.15585 14.5446 8.98668C14.5446 9.26428 14.7693 9.48891 15.0469 9.48891C15.3245 9.48891 15.5491 9.26428 15.5491 8.98668C15.5491 8.15585 16.225 7.47998 17.0558 7.47998C17.3334 7.47998 17.558 7.25535 17.558 6.97775C17.558 6.70015 17.3334 6.47552 17.0558 6.47552C16.225 6.47552 15.5491 5.76616 15.5491 4.93534C15.5491 4.65774 15.3245 4.43311 15.0469 4.43311C14.7693 4.43311 14.5446 4.65774 14.5446 4.93534C14.5446 5.76616 13.8688 6.47552 13.0379 6.47552C12.7603 6.47552 12.5357 6.70015 12.5357 6.97775C12.5357 7.25535 12.7603 7.47998 13.0379 7.47998Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                        <span class="menu-title">Dark</span>
                                    </a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3 my-0">
                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="system">
                                        <span class="menu-icon" data-kt-element="icon">
                                            {/*begin::Svg Icon | path: icons/duotune/general/gen062.svg*/}
                                            <span class="svg-icon svg-icon-3">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clip-rule="evenodd" d="M1.34375 3.9463V15.2178C1.34375 16.119 2.08105 16.8563 2.98219 16.8563H8.65093V19.4594H6.15702C5.38853 19.4594 4.75981 19.9617 4.75981 20.5757V21.6921H19.2403V20.5757C19.2403 19.9617 18.6116 19.4594 17.8431 19.4594H15.3492V16.8563H21.0179C21.919 16.8563 22.6562 16.119 22.6562 15.2178V3.9463C22.6562 3.04516 21.9189 2.30786 21.0179 2.30786H2.98219C2.08105 2.30786 1.34375 3.04516 1.34375 3.9463ZM12.9034 9.9016C13.241 9.98792 13.5597 10.1216 13.852 10.2949L15.0393 9.4353L15.9893 10.3853L15.1297 11.5727C15.303 11.865 15.4366 12.1837 15.523 12.5212L16.97 12.7528V13.4089H13.9851C13.9766 12.3198 13.0912 11.4394 12 11.4394C10.9089 11.4394 10.0235 12.3198 10.015 13.4089H7.03006V12.7528L8.47712 12.5211C8.56345 12.1836 8.69703 11.8649 8.87037 11.5727L8.0107 10.3853L8.96078 9.4353L10.148 10.2949C10.4404 10.1215 10.759 9.98788 11.0966 9.9016L11.3282 8.45467H12.6718L12.9034 9.9016ZM16.1353 7.93758C15.6779 7.93758 15.3071 7.56681 15.3071 7.1094C15.3071 6.652 15.6779 6.28122 16.1353 6.28122C16.5926 6.28122 16.9634 6.652 16.9634 7.1094C16.9634 7.56681 16.5926 7.93758 16.1353 7.93758ZM2.71385 14.0964V3.90518C2.71385 3.78023 2.81612 3.67796 2.94107 3.67796H21.0589C21.1839 3.67796 21.2861 3.78023 21.2861 3.90518V14.0964C15.0954 14.0964 8.90462 14.0964 2.71385 14.0964Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                        <span class="menu-title">System</span>
                                    </a>
                                </div>
                                {/*end::Menu item*/}
                            </div>
                            {/*end::Menu*/}
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="right-end" data-kt-menu-offset="-15px, 0">
                            <a href="#" class="menu-link px-5">
                                <span class="menu-title position-relative">Language
                                <span class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">English
                                <img class="w-15px h-15px rounded-1 ms-2" src="assets/media/flags/united-states.svg" alt="" /></span></span>
                            </a>
                            {/*begin::Menu sub*/}
                            <div class="menu-sub menu-sub-dropdown w-175px py-4">
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/settings.html" class="menu-link d-flex px-5 active">
                                    <span class="symbol symbol-20px me-4">
                                        <img class="rounded-1" src="assets/media/flags/united-states.svg" alt="" />
                                    </span>English</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/settings.html" class="menu-link d-flex px-5">
                                    <span class="symbol symbol-20px me-4">
                                        <img class="rounded-1" src="assets/media/flags/spain.svg" alt="" />
                                    </span>Spanish</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/settings.html" class="menu-link d-flex px-5">
                                    <span class="symbol symbol-20px me-4">
                                        <img class="rounded-1" src="assets/media/flags/germany.svg" alt="" />
                                    </span>German</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/settings.html" class="menu-link d-flex px-5">
                                    <span class="symbol symbol-20px me-4">
                                        <img class="rounded-1" src="assets/media/flags/japan.svg" alt="" />
                                    </span>Japanese</a>
                                </div>
                                {/*end::Menu item*/}
                                {/*begin::Menu item*/}
                                <div class="menu-item px-3">
                                    <a href="../../demo36/dist/account/settings.html" class="menu-link d-flex px-5">
                                    <span class="symbol symbol-20px me-4">
                                        <img class="rounded-1" src="assets/media/flags/france.svg" alt="" />
                                    </span>French</a>
                                </div>
                                {/*end::Menu item*/}
                            </div>
                            {/*end::Menu sub*/}
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5 my-1">
                            <a href="../../demo36/dist/account/settings.html" class="menu-link px-5">Account Settings</a>
                        </div>
                        {/*end::Menu item*/}
                        {/*begin::Menu item*/}
                        <div class="menu-item px-5">
                            <a  class="menu-link px-5">Sign Out</a>
                        </div>
                        {/*end::Menu item*/}
                    </div>
                    {/*end::User account menu*/}
                </div>
                {/*end::User*/}
                {/*begin::Filter*/}
                <button class="btn btn-custom btn-icon w-25px h-25px" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" data-kt-menu-overflow="true">
                    {/*begin::Svg Icon | path: icons/duotune/general/gen031.svg*/}
                    <span class="svg-icon svg-icon-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z" fill="currentColor" />
                        </svg>
                    </span>
                    {/*end::Svg Icon*/}
                </button>
                {/*begin::Menu 1*/}
                <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true" id="kt_menu_63de7a9380a6a">
                    {/*begin::Header*/}
                    <div class="px-7 py-5">
                        <div class="fs-5 text-dark fw-bold">Filter Options</div>
                    </div>
                    {/*end::Header*/}
                    {/*begin::Menu separator*/}
                    <div class="separator border-gray-200"></div>
                    <div class="px-7 py-5">
                        <div class="mb-10">
                            <label class="form-label fw-semibold">Status:</label>
                            <div>
                                <select class="form-select form-select-solid" data-kt-select2="true" data-placeholder="Select option" data-dropdown-parent="#kt_menu_63de7a9380a6a" data-allow-clear="true">
                                    <option></option>
                                    <option value="1">Approved</option>
                                    <option value="2">Pending</option>
                                    <option value="2">In Process</option>
                                    <option value="2">Rejected</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-10">
                            <label class="form-label fw-semibold">Member Type:</label>
                            <div class="d-flex">
                                <label class="form-check form-check-sm form-check-custom form-check-solid me-5">
                                    <input class="form-check-input" type="checkbox" value="1" />
                                    <span class="form-check-label">Author</span>
                                </label>
                                <label class="form-check form-check-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox" value="2" checked="checked" />
                                    <span class="form-check-label">Customer</span>
                                </label>
                            </div>
                        </div>
                        <div class="mb-10">
                            <label class="form-label fw-semibold">Notifications:</label>
                            <div class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="" name="notifications" checked="checked" />
                                <label class="form-check-label">Enabled</label>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="reset" class="btn btn-sm btn-light btn-active-light-primary me-2" data-kt-menu-dismiss="true">Reset</button>
                            <button type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="kt_header_search" class="header-search d-flex align-items-center search-custom w-lg-275px mb-5" data-kt-search-keypress="true" data-kt-search-min-length="2" data-kt-search-enter="enter" data-kt-search-layout="menu" data-kt-search-responsive="false" data-kt-menu-trigger="auto" data-kt-menu-permanent="true" data-kt-menu-placement="bottom-start">
                <form data-kt-search-element="form" class="w-100 position-relative mb-5 mb-lg-0" autocomplete="off">         
                    <input type="hidden" />
                    <span class="svg-icon search-icon svg-icon-2 svg-icon-lg-3 svg-icon-gray-600 position-absolute top-50 translate-middle-y ms-5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                            <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
                        </svg>
                    </span>
                    <input type="text" class="search-input form-control form-control-solid ps-13" name="search" value="" placeholder="Search..." data-kt-search-element="input" />
                    <span class="search-spinner position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-5" data-kt-search-element="spinner">
                        <span class="spinner-border h-15px w-15px align-middle text-gray-400"></span>
                    </span>
                    <span class="search-reset btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-4" data-kt-search-element="clear">
                   
                        <span class="svg-icon svg-icon-2 svg-icon-lg-1 me-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
                                <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
                            </svg>
                        </span>
                    </span>
                </form>
                {/*begin::Menu*/}
                <div data-kt-search-element="content" class="menu menu-sub menu-sub-dropdown w-300px w-md-350px py-7 px-7 overflow-hidden">
                    {/*begin::Wrapper*/}
                    <div data-kt-search-element="wrapper">
                        {/*begin::Recently viewed*/}
                        <div data-kt-search-element="results" class="d-none">
                            {/*begin::Items*/}
                            <div class="scroll-y mh-200px mh-lg-350px">
                                {/*begin::Category title*/}
                                <h3 class="fs-5 text-muted m-0 pb-5" data-kt-search-element="category-title">Users</h3>
                                {/*end::Category title*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <img src="assets/media/avatars/300-6.jpg" alt="" />
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Karina Clark</span>
                                        <span class="fs-7 fw-semibold text-muted">Marketing Manager</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <img src="assets/media/avatars/300-2.jpg" alt="" />
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Olivia Bold</span>
                                        <span class="fs-7 fw-semibold text-muted">Software Engineer</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <img src="assets/media/avatars/300-9.jpg" alt="" />
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Ana Clark</span>
                                        <span class="fs-7 fw-semibold text-muted">UI/UX Designer</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <img src="assets/media/avatars/300-14.jpg" alt="" />
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Nick Pitola</span>
                                        <span class="fs-7 fw-semibold text-muted">Art Director</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <img src="assets/media/avatars/300-11.jpg" alt="" />
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Edward Kulnic</span>
                                        <span class="fs-7 fw-semibold text-muted">System Administrator</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Category title*/}
                                <h3 class="fs-5 text-muted m-0 pt-5 pb-5" data-kt-search-element="category-title">Customers</h3>
                                {/*end::Category title*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            <img class="w-20px h-20px" src="assets/media/svg/brand-logos/volicity-9.svg" alt="" />
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Company Rbranding</span>
                                        <span class="fs-7 fw-semibold text-muted">UI Design</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            <img class="w-20px h-20px" src="assets/media/svg/brand-logos/tvit.svg" alt="" />
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Company Re-branding</span>
                                        <span class="fs-7 fw-semibold text-muted">Web Development</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            <img class="w-20px h-20px" src="assets/media/svg/misc/infography.svg" alt="" />
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Business Analytics App</span>
                                        <span class="fs-7 fw-semibold text-muted">Administration</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            <img class="w-20px h-20px" src="assets/media/svg/brand-logos/leaf.svg" alt="" />
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">EcoLeaf App Launch</span>
                                        <span class="fs-7 fw-semibold text-muted">Marketing</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            <img class="w-20px h-20px" src="assets/media/svg/brand-logos/tower.svg" alt="" />
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column justify-content-start fw-semibold">
                                        <span class="fs-6 fw-semibold">Tower Group Website</span>
                                        <span class="fs-7 fw-semibold text-muted">Google Adwords</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Category title*/}
                                <h3 class="fs-5 text-muted m-0 pt-5 pb-5" data-kt-search-element="category-title">Projects</h3>
                                {/*end::Category title*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/general/gen005.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor" />
                                                    <rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor" />
                                                    <rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor" />
                                                    <rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor" />
                                                    <path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <span class="fs-6 fw-semibold">Si-Fi Project by AU Themes</span>
                                        <span class="fs-7 fw-semibold text-muted">#45670</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/general/gen032.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="8" y="9" width="3" height="10" rx="1.5" fill="currentColor" />
                                                    <rect opacity="0.5" x="13" y="5" width="3" height="14" rx="1.5" fill="currentColor" />
                                                    <rect x="18" y="11" width="3" height="8" rx="1.5" fill="currentColor" />
                                                    <rect x="3" y="13" width="3" height="6" rx="1.5" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <span class="fs-6 fw-semibold">Shopix Mobile App Planning</span>
                                        <span class="fs-7 fw-semibold text-muted">#45690</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/communication/com012.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M20 3H4C2.89543 3 2 3.89543 2 5V16C2 17.1046 2.89543 18 4 18H4.5C5.05228 18 5.5 18.4477 5.5 19V21.5052C5.5 22.1441 6.21212 22.5253 6.74376 22.1708L11.4885 19.0077C12.4741 18.3506 13.6321 18 14.8167 18H20C21.1046 18 22 17.1046 22 16V5C22 3.89543 21.1046 3 20 3Z" fill="currentColor" />
                                                    <rect x="6" y="12" width="7" height="2" rx="1" fill="currentColor" />
                                                    <rect x="6" y="7" width="12" height="2" rx="1" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <span class="fs-6 fw-semibold">Finance Monitoring SAAS Discussion</span>
                                        <span class="fs-7 fw-semibold text-muted">#21090</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <a href="#" class="d-flex text-dark text-hover-primary align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/communication/com006.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z" fill="currentColor" />
                                                    <path d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z" fill="currentColor" />
                                                    <rect x="7" y="6" width="4" height="4" rx="2" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <span class="fs-6 fw-semibold">Dashboard Analitics Launch</span>
                                        <span class="fs-7 fw-semibold text-muted">#34560</span>
                                    </div>
                                    {/*end::Title*/}
                                </a>
                                {/*end::Item*/}
                            </div>
                            {/*end::Items*/}
                        </div>
                        {/*end::Recently viewed*/}
                        {/*begin::Recently viewed*/}
                        <div class="" data-kt-search-element="main">
                            {/*begin::Heading*/}
                            <div class="d-flex flex-stack fw-semibold mb-4">
                                {/*begin::Label*/}
                                <span class="text-muted fs-6 me-2">Recently Searched:</span>
                                {/*end::Label*/}
                                {/*begin::Toolbar*/}
                                <div class="d-flex" data-kt-search-element="toolbar">
                                    {/*begin::Preferences toggle*/}
                                    <div data-kt-search-element="preferences-show" class="btn btn-icon w-20px btn-sm btn-active-color-primary me-2 data-bs-toggle=" title="Show search preferences">
                                        {/*begin::Svg Icon | path: icons/duotune/coding/cod001.svg*/}
                                        <span class="svg-icon svg-icon-1">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.3" d="M22.1 11.5V12.6C22.1 13.2 21.7 13.6 21.2 13.7L19.9 13.9C19.7 14.7 19.4 15.5 18.9 16.2L19.7 17.2999C20 17.6999 20 18.3999 19.6 18.7999L18.8 19.6C18.4 20 17.8 20 17.3 19.7L16.2 18.9C15.5 19.3 14.7 19.7 13.9 19.9L13.7 21.2C13.6 21.7 13.1 22.1 12.6 22.1H11.5C10.9 22.1 10.5 21.7 10.4 21.2L10.2 19.9C9.4 19.7 8.6 19.4 7.9 18.9L6.8 19.7C6.4 20 5.7 20 5.3 19.6L4.5 18.7999C4.1 18.3999 4.1 17.7999 4.4 17.2999L5.2 16.2C4.8 15.5 4.4 14.7 4.2 13.9L2.9 13.7C2.4 13.6 2 13.1 2 12.6V11.5C2 10.9 2.4 10.5 2.9 10.4L4.2 10.2C4.4 9.39995 4.7 8.60002 5.2 7.90002L4.4 6.79993C4.1 6.39993 4.1 5.69993 4.5 5.29993L5.3 4.5C5.7 4.1 6.3 4.10002 6.8 4.40002L7.9 5.19995C8.6 4.79995 9.4 4.39995 10.2 4.19995L10.4 2.90002C10.5 2.40002 11 2 11.5 2H12.6C13.2 2 13.6 2.40002 13.7 2.90002L13.9 4.19995C14.7 4.39995 15.5 4.69995 16.2 5.19995L17.3 4.40002C17.7 4.10002 18.4 4.1 18.8 4.5L19.6 5.29993C20 5.69993 20 6.29993 19.7 6.79993L18.9 7.90002C19.3 8.60002 19.7 9.39995 19.9 10.2L21.2 10.4C21.7 10.5 22.1 11 22.1 11.5ZM12.1 8.59998C10.2 8.59998 8.6 10.2 8.6 12.1C8.6 14 10.2 15.6 12.1 15.6C14 15.6 15.6 14 15.6 12.1C15.6 10.2 14 8.59998 12.1 8.59998Z" fill="currentColor" />
                                                <path d="M17.1 12.1C17.1 14.9 14.9 17.1 12.1 17.1C9.30001 17.1 7.10001 14.9 7.10001 12.1C7.10001 9.29998 9.30001 7.09998 12.1 7.09998C14.9 7.09998 17.1 9.29998 17.1 12.1ZM12.1 10.1C11 10.1 10.1 11 10.1 12.1C10.1 13.2 11 14.1 12.1 14.1C13.2 14.1 14.1 13.2 14.1 12.1C14.1 11 13.2 10.1 12.1 10.1Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                    </div>
                                    {/*end::Preferences toggle*/}
                                    {/*begin::Advanced search toggle*/}
                                    <div data-kt-search-element="advanced-options-form-show" class="btn btn-icon w-20px btn-sm btn-active-color-primary me-n1" data-bs-toggle="tooltip" title="Show more search options">
                                        {/*begin::Svg Icon | path: icons/duotune/arrows/arr072.svg*/}
                                        <span class="svg-icon svg-icon-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                    </div>
                                    {/*end::Advanced search toggle*/}
                                </div>
                                {/*end::Toolbar*/}
                            </div>
                            {/*end::Heading*/}
                            {/*begin::Items*/}
                            <div class="scroll-y mh-200px mh-lg-325px">
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/electronics/elc004.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 16C2 16.6 2.4 17 3 17H21C21.6 17 22 16.6 22 16V15H2V16Z" fill="currentColor" />
                                                    <path opacity="0.3" d="M21 3H3C2.4 3 2 3.4 2 4V15H22V4C22 3.4 21.6 3 21 3Z" fill="currentColor" />
                                                    <path opacity="0.3" d="M15 17H9V20H15V17Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">BoomApp by Keenthemes</a>
                                        <span class="fs-7 text-muted fw-semibold">#45789</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/graphs/gra001.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M14 3V21H10V3C10 2.4 10.4 2 11 2H13C13.6 2 14 2.4 14 3ZM7 14H5C4.4 14 4 14.4 4 15V21H8V15C8 14.4 7.6 14 7 14Z" fill="currentColor" />
                                                    <path d="M21 20H20V8C20 7.4 19.6 7 19 7H17C16.4 7 16 7.4 16 8V20H3C2.4 20 2 20.4 2 21C2 21.6 2.4 22 3 22H21C21.6 22 22 21.6 22 21C22 20.4 21.6 20 21 20Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">"Kept API Project Meeting</a>
                                        <span class="fs-7 text-muted fw-semibold">#84050</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/graphs/gra006.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13 5.91517C15.8 6.41517 18 8.81519 18 11.8152C18 12.5152 17.9 13.2152 17.6 13.9152L20.1 15.3152C20.6 15.6152 21.4 15.4152 21.6 14.8152C21.9 13.9152 22.1 12.9152 22.1 11.8152C22.1 7.01519 18.8 3.11521 14.3 2.01521C13.7 1.91521 13.1 2.31521 13.1 3.01521V5.91517H13Z" fill="currentColor" />
                                                    <path opacity="0.3" d="M19.1 17.0152C19.7 17.3152 19.8 18.1152 19.3 18.5152C17.5 20.5152 14.9 21.7152 12 21.7152C9.1 21.7152 6.50001 20.5152 4.70001 18.5152C4.30001 18.0152 4.39999 17.3152 4.89999 17.0152L7.39999 15.6152C8.49999 16.9152 10.2 17.8152 12 17.8152C13.8 17.8152 15.5 17.0152 16.6 15.6152L19.1 17.0152ZM6.39999 13.9151C6.19999 13.2151 6 12.5152 6 11.8152C6 8.81517 8.2 6.41515 11 5.91515V3.01519C11 2.41519 10.4 1.91519 9.79999 2.01519C5.29999 3.01519 2 7.01517 2 11.8152C2 12.8152 2.2 13.8152 2.5 14.8152C2.7 15.4152 3.4 15.7152 4 15.3152L6.39999 13.9151Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">"KPI Monitoring App Launch</a>
                                        <span class="fs-7 text-muted fw-semibold">#84250</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/graphs/gra002.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M20 8L12.5 5L5 14V19H20V8Z" fill="currentColor" />
                                                    <path d="M21 18H6V3C6 2.4 5.6 2 5 2C4.4 2 4 2.4 4 3V18H3C2.4 18 2 18.4 2 19C2 19.6 2.4 20 3 20H4V21C4 21.6 4.4 22 5 22C5.6 22 6 21.6 6 21V20H21C21.6 20 22 19.6 22 19C22 18.4 21.6 18 21 18Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">Project Reference FAQ</a>
                                        <span class="fs-7 text-muted fw-semibold">#67945</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/communication/com010.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 8.725C6 8.125 6.4 7.725 7 7.725H14L18 11.725V12.925L22 9.725L12.6 2.225C12.2 1.925 11.7 1.925 11.4 2.225L2 9.725L6 12.925V8.725Z" fill="currentColor" />
                                                    <path opacity="0.3" d="M22 9.72498V20.725C22 21.325 21.6 21.725 21 21.725H3C2.4 21.725 2 21.325 2 20.725V9.72498L11.4 17.225C11.8 17.525 12.3 17.525 12.6 17.225L22 9.72498ZM15 11.725H18L14 7.72498V10.725C14 11.325 14.4 11.725 15 11.725Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">"FitPro App Development</a>
                                        <span class="fs-7 text-muted fw-semibold">#84250</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/finance/fin001.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 19.725V18.725C20 18.125 19.6 17.725 19 17.725H5C4.4 17.725 4 18.125 4 18.725V19.725H3C2.4 19.725 2 20.125 2 20.725V21.725H22V20.725C22 20.125 21.6 19.725 21 19.725H20Z" fill="currentColor" />
                                                    <path opacity="0.3" d="M22 6.725V7.725C22 8.325 21.6 8.725 21 8.725H18C18.6 8.725 19 9.125 19 9.725C19 10.325 18.6 10.725 18 10.725V15.725C18.6 15.725 19 16.125 19 16.725V17.725H15V16.725C15 16.125 15.4 15.725 16 15.725V10.725C15.4 10.725 15 10.325 15 9.725C15 9.125 15.4 8.725 16 8.725H13C13.6 8.725 14 9.125 14 9.725C14 10.325 13.6 10.725 13 10.725V15.725C13.6 15.725 14 16.125 14 16.725V17.725H10V16.725C10 16.125 10.4 15.725 11 15.725V10.725C10.4 10.725 10 10.325 10 9.725C10 9.125 10.4 8.725 11 8.725H8C8.6 8.725 9 9.125 9 9.725C9 10.325 8.6 10.725 8 10.725V15.725C8.6 15.725 9 16.125 9 16.725V17.725H5V16.725C5 16.125 5.4 15.725 6 15.725V10.725C5.4 10.725 5 10.325 5 9.725C5 9.125 5.4 8.725 6 8.725H3C2.4 8.725 2 8.325 2 7.725V6.725L11 2.225C11.6 1.925 12.4 1.925 13.1 2.225L22 6.725ZM12 3.725C11.2 3.725 10.5 4.425 10.5 5.225C10.5 6.025 11.2 6.725 12 6.725C12.8 6.725 13.5 6.025 13.5 5.225C13.5 4.425 12.8 3.725 12 3.725Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">Shopix Mobile App</a>
                                        <span class="fs-7 text-muted fw-semibold">#45690</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                                {/*begin::Item*/}
                                <div class="d-flex align-items-center mb-5">
                                    {/*begin::Symbol*/}
                                    <div class="symbol symbol-40px me-4">
                                        <span class="symbol-label bg-light">
                                            {/*begin::Svg Icon | path: icons/duotune/graphs/gra002.svg*/}
                                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M20 8L12.5 5L5 14V19H20V8Z" fill="currentColor" />
                                                    <path d="M21 18H6V3C6 2.4 5.6 2 5 2C4.4 2 4 2.4 4 3V18H3C2.4 18 2 18.4 2 19C2 19.6 2.4 20 3 20H4V21C4 21.6 4.4 22 5 22C5.6 22 6 21.6 6 21V20H21C21.6 20 22 19.6 22 19C22 18.4 21.6 18 21 18Z" fill="currentColor" />
                                                </svg>
                                            </span>
                                            {/*end::Svg Icon*/}
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}
                                    {/*begin::Title*/}
                                    <div class="d-flex flex-column">
                                        <a href="#" class="fs-6 text-gray-800 text-hover-primary fw-semibold">"Landing UI Design" Launch</a>
                                        <span class="fs-7 text-muted fw-semibold">#24005</span>
                                    </div>
                                    {/*end::Title*/}
                                </div>
                                {/*end::Item*/}
                            </div>
                            {/*end::Items*/}
                        </div>
                        {/*end::Recently viewed*/}
                        {/*begin::Empty*/}
                        <div data-kt-search-element="empty" class="text-center d-none">
                            {/*begin::Icon*/}
                            <div class="pt-10 pb-10">
                                {/*begin::Svg Icon | path: icons/duotune/files/fil024.svg*/}
                                <span class="svg-icon svg-icon-4x opacity-50">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.3" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="currentColor" />
                                        <path d="M20 8L14 2V6C14 7.10457 14.8954 8 16 8H20Z" fill="currentColor" />
                                        <rect x="13.6993" y="13.6656" width="4.42828" height="1.73089" rx="0.865447" transform="rotate(45 13.6993 13.6656)" fill="currentColor" />
                                        <path d="M15 12C15 14.2 13.2 16 11 16C8.8 16 7 14.2 7 12C7 9.8 8.8 8 11 8C13.2 8 15 9.8 15 12ZM11 9.6C9.68 9.6 8.6 10.68 8.6 12C8.6 13.32 9.68 14.4 11 14.4C12.32 14.4 13.4 13.32 13.4 12C13.4 10.68 12.32 9.6 11 9.6Z" fill="currentColor" />
                                    </svg>
                                </span>
                                {/*end::Svg Icon*/}
                            </div>
                            {/*end::Icon*/}
                            {/*begin::Message*/}
                            <div class="pb-15 fw-semibold">
                                <h3 class="text-gray-600 fs-5 mb-2">No result found</h3>
                                <div class="text-muted fs-7">Please try again with a different query</div>
                            </div>
                            {/*end::Message*/}
                        </div>
                        {/*end::Empty*/}
                    </div>
                    {/*end::Wrapper*/}
                    {/*begin::Preferences*/}
                    <form data-kt-search-element="advanced-options-form" class="pt-1 d-none">
                        {/*begin::Heading*/}
                        <h3 class="fw-semibold text-dark mb-7">Advanced Search</h3>
                        {/*end::Heading*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Contains the word" name="query" />
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            {/*begin::Radio group*/}
                            <div class="nav-group nav-group-fluid">
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="type" value="has" checked="checked" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary">All</span>
                                </label>
                                {/*end::Option*/}
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="type" value="users" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4">Users</span>
                                </label>
                                {/*end::Option*/}
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="type" value="orders" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4">Orders</span>
                                </label>
                                {/*end::Option*/}
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="type" value="projects" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4">Projects</span>
                                </label>
                                {/*end::Option*/}
                            </div>
                            {/*end::Radio group*/}
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            <input type="text" name="assignedto" class="form-control form-control-sm form-control-solid" placeholder="Assigned to" value="" />
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            <input type="text" name="collaborators" class="form-control form-control-sm form-control-solid" placeholder="Collaborators" value="" />
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            {/*begin::Radio group*/}
                            <div class="nav-group nav-group-fluid">
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="attachment" value="has" checked="checked" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary">Has attachment</span>
                                </label>
                                {/*end::Option*/}
                                {/*begin::Option*/}
                                <label>
                                    <input type="radio" class="btn-check" name="attachment" value="any" />
                                    <span class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4">Any</span>
                                </label>
                                {/*end::Option*/}
                            </div>
                            {/*end::Radio group*/}
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="mb-5">
                            <select name="timezone" aria-label="Select a Timezone" data-control="select2" data-placeholder="date_period" class="form-select form-select-sm form-select-solid">
                                <option value="next">Within the next</option>
                                <option value="last">Within the last</option>
                                <option value="between">Between</option>
                                <option value="on">On</option>
                            </select>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="row mb-8">
                            {/*begin::Col*/}
                            <div class="col-6">
                                <input type="number" name="date_number" class="form-control form-control-sm form-control-solid" placeholder="Lenght" value="" />
                            </div>
                            {/*end::Col*/}
                            {/*begin::Col*/}
                            <div class="col-6">
                                <select name="date_typer" aria-label="Select a Timezone" data-control="select2" data-placeholder="Period" class="form-select form-select-sm form-select-solid">
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                            {/*end::Col*/}
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Actions*/}
                        <div class="d-flex justify-content-end">
                            <button type="reset" class="btn btn-sm btn-light fw-bold btn-active-light-primary me-2" data-kt-search-element="advanced-options-form-cancel">Cancel</button>
                            <a href="../../demo36/dist/pages/search/horizontal.html" class="btn btn-sm fw-bold btn-primary" data-kt-search-element="advanced-options-form-search">Search</a>
                        </div>
                        {/*end::Actions*/}
                    </form>
                    {/*end::Preferences*/}
                    {/*begin::Preferences*/}
                    <form data-kt-search-element="preferences" class="pt-1 d-none">
                        {/*begin::Heading*/}
                        <h3 class="fw-semibold text-dark mb-7">Search Preferences</h3>
                        {/*end::Heading*/}
                        {/*begin::Input group*/}
                        <div class="pb-4 border-bottom">
                            <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                <span class="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">Projects</span>
                                <input class="form-check-input" type="checkbox" value="1" checked="checked" />
                            </label>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="py-4 border-bottom">
                            <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                <span class="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">Targets</span>
                                <input class="form-check-input" type="checkbox" value="1" checked="checked" />
                            </label>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="py-4 border-bottom">
                            <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                <span class="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">Affiliate Programs</span>
                                <input class="form-check-input" type="checkbox" value="1" />
                            </label>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="py-4 border-bottom">
                            <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                <span class="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">Referrals</span>
                                <input class="form-check-input" type="checkbox" value="1" checked="checked" />
                            </label>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Input group*/}
                        <div class="py-4 border-bottom">
                            <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                <span class="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">Users</span>
                                <input class="form-check-input" type="checkbox" value="1" />
                            </label>
                        </div>
                        {/*end::Input group*/}
                        {/*begin::Actions*/}
                        <div class="d-flex justify-content-end pt-7">
                            <button type="reset" class="btn btn-sm btn-light fw-bold btn-active-light-primary me-2" data-kt-search-element="preferences-dismiss">Cancel</button>
                            <button type="submit" class="btn btn-sm fw-bold btn-primary">Save Changes</button>
                        </div>
                        {/*end::Actions*/}
                    </form>
                    {/*end::Preferences*/}
                </div>
                {/*end::Menu*/}
            </div>
            {/*end::Search*/}
        </div>
        {/*end::Header*/}
        {/*begin::Navs*/}
        <div class="app-sidebar-navs flex-column-fluid" id="kt_app_sidebar_navs">
            <div id="kt_app_sidebar_navs_wrappers" class="hover-scroll-y my-2" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_header, #kt_app_sidebar_projects" data-kt-scroll-wrappers="#kt_app_sidebar_navs" data-kt-scroll-offset="5px">
                {/*begin::Sidebar menu*/}
                <div id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false" class="menu menu-column menu-rounded menu-sub-indention menu-state-bullet-primary">
                    {/*begin::Heading*/}
                    <div class="menu-item">
                        <div class="menu-content menu-heading text-uppercase fs-7">Pages</div>
                    </div>
                    {/*end::Heading*/}
                    {/* {menuList} */}
                     {/*begin:Menu item dynamic*/}
                     <div data-kt-menu-trigger="click" class="menu-item here show menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-house fs-2"></i>
                            </span>
                            <span class="menu-title">Dashboards</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link active" href="../../demo36/dist/index.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Default</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/ecommerce.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">eCommerce</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/projects.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Projects</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/online-courses.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Online Courses</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/marketing.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Marketing</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            <div class="menu-inner flex-column collapse" id="kt_app_sidebar_menu_dashboards_collapse">
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/bidding.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Bidding</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/pos.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">POS System</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/call-center.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Call Center</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/logistics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Logistics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/website-analytics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Website Analytics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/finance-performance.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Finance Performance</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/store-analytics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Store Analytics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/social.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Social</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/delivery.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Delivery</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/crypto.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Crypto</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/school.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">School</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/podcast.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Podcast</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/landing.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Landing</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                            </div>
                            <div class="menu-item">
                                <div class="menu-content">
                                    <a class="btn btn-flex btn-color-primary d-flex flex-stack fs-base p-0 ms-2 mb-2 toggle collapsible collapsed" data-bs-toggle="collapse" href="#kt_app_sidebar_menu_dashboards_collapse" data-kt-toggle-text="Show Less">
                                        <span data-kt-toggle-text-target="true">Show 12 More</span>
                                        {/*begin::Svg Icon | path: icons/duotune/general/gen036.svg*/}
                                        <span class="svg-icon toggle-on svg-icon-2 me-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
                                                <rect x="6.0104" y="10.9247" width="12" height="2" rx="1" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                        {/*begin::Svg Icon | path: icons/duotune/general/gen035.svg*/}
                                        <span class="svg-icon toggle-off svg-icon-2 me-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
                                                <rect x="10.8891" y="17.8033" width="12" height="2" rx="1" transform="rotate(-90 10.8891 17.8033)" fill="currentColor" />
                                                <rect x="6.01041" y="10.9247" width="12" height="2" rx="1" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item dynamic*/}

                    
                    
                    {/*begin:Menu item*/}
                    <div data-kt-menu-trigger="click" class="menu-item here menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-house fs-2"></i>
                            </span>
                            <span class="menu-title">Dashboards</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link active" href="../../demo36/dist/index.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Default</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/ecommerce.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">eCommerce</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/projects.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Projects</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/online-courses.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Online Courses</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/dashboards/marketing.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Marketing</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            <div class="menu-inner flex-column collapse" id="kt_app_sidebar_menu_dashboards_collapse">
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/bidding.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Bidding</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/pos.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">POS System</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/call-center.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Call Center</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/logistics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Logistics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/website-analytics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Website Analytics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/finance-performance.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Finance Performance</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/store-analytics.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Store Analytics</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/social.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Social</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/delivery.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Delivery</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/crypto.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Crypto</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/school.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">School</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/dashboards/podcast.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Podcast</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                                {/*begin:Menu item*/}
                                <div class="menu-item">
                                    {/*begin:Menu link*/}
                                    <a class="menu-link" href="../../demo36/dist/landing.html">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Landing</span>
                                    </a>
                                    {/*end:Menu link*/}
                                </div>
                                {/*end:Menu item*/}
                            </div>
                            <div class="menu-item">
                                <div class="menu-content">
                                    <a class="btn btn-flex btn-color-primary d-flex flex-stack fs-base p-0 ms-2 mb-2 toggle collapsible collapsed" data-bs-toggle="collapse" href="#kt_app_sidebar_menu_dashboards_collapse" data-kt-toggle-text="Show Less">
                                        <span data-kt-toggle-text-target="true">Show 12 More</span>
                                        {/*begin::Svg Icon | path: icons/duotune/general/gen036.svg*/}
                                        <span class="svg-icon toggle-on svg-icon-2 me-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
                                                <rect x="6.0104" y="10.9247" width="12" height="2" rx="1" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                        {/*begin::Svg Icon | path: icons/duotune/general/gen035.svg*/}
                                        <span class="svg-icon toggle-off svg-icon-2 me-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
                                                <rect x="10.8891" y="17.8033" width="12" height="2" rx="1" transform="rotate(-90 10.8891 17.8033)" fill="currentColor" />
                                                <rect x="6.01041" y="10.9247" width="12" height="2" rx="1" fill="currentColor" />
                                            </svg>
                                        </span>
                                        {/*end::Svg Icon*/}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item*/}
                    {/*begin:Menu item*/}
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-stats fs-2"></i>
                            </span>
                            <span class="menu-title">Pages</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">User Profile</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/overview.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Overview</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/projects.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Projects</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/campaigns.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Campaigns</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/documents.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Documents</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/followers.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Followers</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/user-profile/activity.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Activity</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Account</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/overview.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Overview</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/settings.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Settings</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/security.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Security</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/activity.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Activity</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/billing.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Billing</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/statements.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Statements</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/referrals.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Referrals</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/api-keys.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">API Keys</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/account/logs.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Logs</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Authentication</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Corporate Layout</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/corporate/sign-in.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-in</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/corporate/sign-up.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-up</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/corporate/two-steps.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Two-steps</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/corporate/reset-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Reset Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/corporate/new-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Overlay Layout</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/overlay/sign-in.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-in</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/overlay/sign-up.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-up</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/overlay/two-steps.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Two-steps</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/overlay/reset-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Reset Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/overlay/new-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Creative Layout</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/creative/sign-in.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-in</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/creative/sign-up.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-up</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/creative/two-steps.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Two-steps</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/creative/reset-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Reset Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/creative/new-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Fancy Layout</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/fancy/sign-in.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-in</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/fancy/sign-up.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sign-up</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/fancy/two-steps.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Two-steps</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/fancy/reset-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Reset Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/layouts/fancy/new-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Email Templates</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/welcome-message.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Welcome Message</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/reset-password.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Reset Password</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/subscription-confirmed.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Subscription Confirmed</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/card-declined.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Credit Card Declined</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/promo-1.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Promo 1</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/promo-2.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Promo 2</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/authentication/email/promo-3.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Promo 3</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/extended/multi-steps-sign-up.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Multi-steps Sign-up</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/extended/two-factor-auth.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Two Factor Auth</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/welcome.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Welcome Message</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/verify-email.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Verify Email</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/coming-soon.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Coming Soon</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/password-confirmation.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Password Confirmation</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/account-deactivated.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Account Deactivation</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/error-404.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Error 404</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/authentication/general/error-500.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Error 500</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Corporate</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/about.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">About</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/team.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Our Team</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/contact.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Contact Us</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/licenses.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Licenses</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/sitemap.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Sitemap</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Social</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/social/feeds.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Feeds</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/social/activity.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Activty</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/social/followers.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Followers</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/social/settings.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Settings</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Blog</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/blog/home.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Blog Home</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/blog/post.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Blog Post</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">FAQ</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/faq/classic.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">FAQ Classic</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/faq/extended.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">FAQ Extended</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Pricing</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/pricing/column.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Column Pricing</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/pricing/table.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Table Pricing</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Careers</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/careers/list.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Careers List</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/pages/careers/apply.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Careers Apply</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Widgets</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/lists.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Lists</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/statistics.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Statistics</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/charts.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Charts</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/mixed.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Mixed</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/tables.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Tables</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/widgets/feeds.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Feeds</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item*/}
                    {/*begin:Menu item*/}
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-app-store fs-2"></i>
                            </span>
                            <span class="menu-title">Apps</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Projects</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/list.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">My Projects</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/project.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">View Project</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/targets.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Targets</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/budget.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Budget</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/users.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Users</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/files.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Files</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/activity.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Activity</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/projects/settings.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Settings</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">eCommerce</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Catalog</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/products.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Products</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/categories.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Categories</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/add-product.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Add Product</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/edit-product.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Edit Product</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/add-category.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Add Category</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/catalog/edit-category.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Edit Category</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Sales</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/sales/listing.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Orders Listing</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/sales/details.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Order Details</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/sales/add-order.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Add Order</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/sales/edit-order.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Edit Order</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Customers</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/customers/listing.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Customer Listing</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/customers/details.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Customer Details</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Reports</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/reports/view.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Products Viewed</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/reports/sales.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Sales</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/reports/returns.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Returns</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/reports/customer-orders.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Customer Orders</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/ecommerce/reports/shipping.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Shipping</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/ecommerce/settings.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Settings</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Contacts</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/contacts/getting-started.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Getting Started</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/contacts/add-contact.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Add Contact</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/contacts/edit-contact.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Edit Contact</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/contacts/view-contact.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">View Contact</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Support Center</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/support-center/overview.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Overview</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion mb-1">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Tickets</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/support-center/tickets/list.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Tickets List</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/support-center/tickets/view.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">View Ticket</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion mb-1">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Tutorials</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/support-center/tutorials/list.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Tutorials List</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/support-center/tutorials/post.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Tutorial Post</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/support-center/faq.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">FAQ</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/support-center/licenses.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Licenses</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/support-center/contact.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Contact Us</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">User Management</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion mb-1">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Users</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/user-management/users/list.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Users List</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/user-management/users/view.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">View User</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Roles</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/user-management/roles/list.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Roles List</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/user-management/roles/view.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">View Role</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/user-management/permissions.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Permissions</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Customers</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/customers/getting-started.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Getting Started</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/customers/list.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Customer Listing</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/customers/view.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Customer Details</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Subscription</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/subscriptions/getting-started.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Getting Started</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/subscriptions/list.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Subscription List</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/subscriptions/add.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Add Subscription</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/subscriptions/view.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">View Subscription</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Invoice Manager</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">View Invoices</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/invoices/view/invoice-1.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Invoice 1</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/invoices/view/invoice-2.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Invoice 2</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/apps/invoices/view/invoice-3.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Invoice 3</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/invoices/create.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Create Invoice</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">File Manager</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/file-manager/folders.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Folders</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/file-manager/files.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Files</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/file-manager/blank.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Blank Directory</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/file-manager/settings.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Settings</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Inbox</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/inbox/listing.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Messages</span>
                                            <span class="menu-badge">
                                                <span class="badge badge-success">3</span>
                                            </span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/inbox/compose.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Compose</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/inbox/reply.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">View & Reply</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Chat</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/chat/private.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Private Chat</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/chat/group.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Group Chat</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/apps/chat/drawer.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Drawer Chat</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="../../demo36/dist/apps/calendar.html">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Calendar</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item*/}
                    {/*begin:Menu item*/}
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-image fs-2"></i>
                            </span>
                            <span class="menu-title">Utilities</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Modals</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">General</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/general/invite-friends.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Invite Friends</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/general/view-users.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">View Users</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/general/select-users.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Select Users</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/general/upgrade-plan.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Upgrade Plan</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/general/share-earn.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Share & Earn</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Forms</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/forms/new-target.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Target</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/forms/new-card.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Card</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/forms/new-address.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">New Address</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/forms/create-api-key.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Create API Key</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/forms/bidding.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Bidding</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Wizards</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/create-app.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Create App</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/create-campaign.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Create Campaign</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/create-account.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Create Business Acc</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/create-project.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Create Project</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/top-up-wallet.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Top Up Wallet</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/offer-a-deal.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Offer a Deal</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/two-factor-authentication.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Two Factor Auth</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                        {/*begin:Menu link*/}
                                        <span class="menu-link">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Search</span>
                                            <span class="menu-arrow"></span>
                                        </span>
                                        {/*end:Menu link*/}
                                        {/*begin:Menu sub*/}
                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/search/users.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Users</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                            {/*begin:Menu item*/}
                                            <div class="menu-item">
                                                {/*begin:Menu link*/}
                                                <a class="menu-link" href="../../demo36/dist/utilities/modals/search/select-location.html">
                                                    <span class="menu-bullet">
                                                        <span class="bullet bullet-dot"></span>
                                                    </span>
                                                    <span class="menu-title">Select Location</span>
                                                </a>
                                                {/*end:Menu link*/}
                                            </div>
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Wizards</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/horizontal.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Horizontal</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/vertical.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Vertical</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/two-factor-authentication.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Two Factor Auth</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/create-app.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Create App</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/create-campaign.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Create Campaign</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/create-account.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Create Account</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/create-project.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Create Project</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/modals/wizards/top-up-wallet.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Top Up Wallet</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/wizards/offer-a-deal.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Offer a Deal</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                {/*begin:Menu link*/}
                                <span class="menu-link">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Search</span>
                                    <span class="menu-arrow"></span>
                                </span>
                                {/*end:Menu link*/}
                                {/*begin:Menu sub*/}
                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/search/horizontal.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Horizontal</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/search/vertical.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Vertical</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/search/users.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Users</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                    {/*begin:Menu item*/}
                                    <div class="menu-item">
                                        {/*begin:Menu link*/}
                                        <a class="menu-link" href="../../demo36/dist/utilities/search/select-location.html">
                                            <span class="menu-bullet">
                                                <span class="bullet bullet-dot"></span>
                                            </span>
                                            <span class="menu-title">Location</span>
                                        </a>
                                        {/*end:Menu link*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                                {/*end:Menu sub*/}
                            </div>
                            {/*end:Menu item*/}
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item*/}
                    {/*begin:Menu item*/}
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                        {/*begin:Menu link*/}
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="fonticon-setting fs-2"></i>
                            </span>
                            <span class="menu-title">Help</span>
                            <span class="menu-arrow"></span>
                        </span>
                        {/*end:Menu link*/}
                        {/*begin:Menu sub*/}
                        <div class="menu-sub menu-sub-accordion">
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="https://preview.keenthemes.com/html/metronic/docs/base/utilities" target="_blank" title="Check out over 200 in-house components" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click" data-bs-placement="right">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Components</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="https://preview.keenthemes.com/html/metronic/docs" target="_blank" title="Check out the complete documentation" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click" data-bs-placement="right">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Documentation</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="https://preview.keenthemes.com/metronic8/demo36/layout-builder.html" title="Build your layout and export HTML for server side integration" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click" data-bs-placement="right">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Layout Builder</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                            {/*begin:Menu item*/}
                            <div class="menu-item">
                                {/*begin:Menu link*/}
                                <a class="menu-link" href="https://preview.keenthemes.com/html/metronic/docs/getting-started/changelog" target="_blank">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">Changelog v8.1.7</span>
                                </a>
                                {/*end:Menu link*/}
                            </div>
                            {/*end:Menu item*/}
                        </div>
                        {/*end:Menu sub*/}
                    </div>
                    {/*end:Menu item*/}
                </div>
                {/*end::Sidebar menu*/}
                {/*begin::Separator*/}
                <div class="separator"></div>
                {/*end::Separator*/}
                {/*begin::Projects*/}
                <div class="menu menu-rounded menu-column">
                    {/*begin::Heading*/}
                    <div class="menu-item">
                        <div class="menu-content menu-heading text-uppercase fs-7">Projects</div>
                    </div>
                    {/*end::Heading*/}
                    {/*begin::Menu Item*/}
                    <div class="menu-item">
                        {/*begin::Menu link*/}
                        <a class="menu-link" href="../../demo36/dist/apps/projects/project.html">
                            {/*begin::Bullet*/}
                            <span class="menu-icon">
                                <span class="bullet bullet-dot h-10px w-10px bg-primary"></span>
                            </span>
                            {/*end::Bullet*/}
                            {/*begin::Title*/}
                            <span class="menu-title">Google Ads</span>
                            {/*end::Title*/}
                            {/*begin::Badge*/}
                            <span class="menu-badge">
                                <span class="badge badge-custom">6</span>
                            </span>
                            {/*end::Badge*/}
                        </a>
                        {/*end::Menu link*/}
                    </div>
                    {/*end::Menu Item*/}
                    {/*begin::Menu Item*/}
                    <div class="menu-item">
                        {/*begin::Menu link*/}
                        <a class="menu-link" href="../../demo36/dist/apps/projects/targets.html">
                            {/*begin::Bullet*/}
                            <span class="menu-icon">
                                <span class="bullet bullet-dot h-10px w-10px bg-success"></span>
                            </span>
                            {/*end::Bullet*/}
                            {/*begin::Title*/}
                            <span class="menu-title">AirStoke App</span>
                            {/*end::Title*/}
                            {/*begin::Badge*/}
                            <span class="menu-badge">
                                <span class="badge badge-custom">2</span>
                            </span>
                            {/*end::Badge*/}
                        </a>
                        {/*end::Menu link*/}
                    </div>
                    {/*end::Menu Item*/}
                    {/*begin::Menu Item*/}
                    <div class="menu-item">
                        {/*begin::Menu link*/}
                        <a class="menu-link" href="../../demo36/dist/apps/projects/budget.html">
                            {/*begin::Bullet*/}
                            <span class="menu-icon">
                                <span class="bullet bullet-dot h-10px w-10px bg-warning"></span>
                            </span>
                            {/*end::Bullet*/}
                            {/*begin::Title*/}
                            <span class="menu-title">Internal Tasks</span>
                            {/*end::Title*/}
                            {/*begin::Badge*/}
                            <span class="menu-badge">
                                <span class="badge badge-custom">37</span>
                            </span>
                            {/*end::Badge*/}
                        </a>
                        {/*end::Menu link*/}
                    </div>
                    {/*end::Menu Item*/}
                    {/*begin::Collapsible items*/}
                    <div class="menu-inner flex-column collapse" id="kt_app_sidebar_menu_projects_collapse">
                        {/*begin::Menu Item*/}
                        <div class="menu-item">
                            {/*begin::Menu link*/}
                            <a class="menu-link" href="../../demo36/dist/apps/projects/users.html">
                                {/*begin::Bullet*/}
                                <span class="menu-icon">
                                    <span class="bullet bullet-dot h-10px w-10px bg-danger"></span>
                                </span>
                                {/*end::Bullet*/}
                                {/*begin::Title*/}
                                <span class="menu-title">Fitnes App</span>
                                {/*end::Title*/}
                                {/*begin::Badge*/}
                                <span class="menu-badge">
                                    <span class="badge badge-custom">3</span>
                                </span>
                                {/*end::Badge*/}
                            </a>
                            {/*end::Menu link*/}
                        </div>
                        {/*end::Menu Item*/}
                        {/*begin::Menu Item*/}
                        <div class="menu-item">
                            {/*begin::Menu link*/}
                            <a class="menu-link" href="../../demo36/dist/apps/projects/files.html">
                                {/*begin::Bullet*/}
                                <span class="menu-icon">
                                    <span class="bullet bullet-dot h-10px w-10px bg-info"></span>
                                </span>
                                {/*end::Bullet*/}
                                {/*begin::Title*/}
                                <span class="menu-title">Oppo CRM</span>
                                {/*end::Title*/}
                                {/*begin::Badge*/}
                                <span class="menu-badge">
                                    <span class="badge badge-custom">12</span>
                                </span>
                                {/*end::Badge*/}
                            </a>
                            {/*end::Menu link*/}
                        </div>
                        {/*end::Menu Item*/}
                        {/*begin::Menu Item*/}
                        <div class="menu-item">
                            {/*begin::Menu link*/}
                            <a class="menu-link" href="../../demo36/dist/apps/projects/activity.html">
                                {/*begin::Bullet*/}
                                <span class="menu-icon">
                                    <span class="bullet bullet-dot h-10px w-10px bg-warning"></span>
                                </span>
                                {/*end::Bullet*/}
                                {/*begin::Title*/}
                                <span class="menu-title">Finance Dispatch</span>
                                {/*end::Title*/}
                                {/*begin::Badge*/}
                                <span class="menu-badge">
                                    <span class="badge badge-custom">25</span>
                                </span>
                                {/*end::Badge*/}
                            </a>
                            {/*end::Menu link*/}
                        </div>
                        {/*end::Menu Item*/}
                    </div>
                    {/*end::Collapsible items*/}
                    {/*begin::Collapse toggle*/}
                    <div class="menu-item">
                        {/*begin::Toggle*/}
                        <a class="menu-link menu-collapse-toggle toggle collapsible collapsed" data-bs-toggle="collapse" href="#kt_app_sidebar_menu_projects_collapse" data-kt-toggle-text="Show less">
                            <span class="menu-icon">
                                {/*begin::Svg Icon | path: icons/duotune/arrows/arr072.svg*/}
                                <span class="svg-icon toggle-off svg-icon-3 me-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor" />
                                    </svg>
                                </span>
                                {/*end::Svg Icon*/}
                                {/*begin::Svg Icon | path: icons/duotune/arrows/arr073.svg*/}
                                <span class="svg-icon toggle-on svg-icon-3 me-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5657 11.3657L16.75 15.55C17.1642 15.9643 17.8358 15.9643 18.25 15.55C18.6642 15.1358 18.6642 14.4643 18.25 14.05L12.7071 8.50716C12.3166 8.11663 11.6834 8.11663 11.2929 8.50715L5.75 14.05C5.33579 14.4643 5.33579 15.1358 5.75 15.55C6.16421 15.9643 6.83579 15.9643 7.25 15.55L11.4343 11.3657C11.7467 11.0533 12.2533 11.0533 12.5657 11.3657Z" fill="currentColor" />
                                    </svg>
                                </span>
                                {/*end::Svg Icon*/}
                            </span>
                            {/*begin::Title*/}
                            <span class="menu-title" data-kt-toggle-text-target="true">Show more</span>
                            {/*end::Title*/}
                        </a>
                        {/*end::Toggle*/}
                    </div>
                    {/*end::Collapse toggle*/}
                </div>
                {/*end::Projects*/}
            </div>
        </div>
        {/*end::Navs*/}
    </div>
    //   <div class="leftbar-tab-menu">
    //     <button
    //       class="side-nav-icon"
    //       id="togglemenu"
    //       onClick={() => {
    //         this.toggleSidebar();
    //       }}
    //     >
    //       <i class="bi bi-arrow-left-right"></i>
    //     </button>
    //     <div class="main-icon-menu">
    //       <div className="logo-icon">
    //         <a class="logo logo-metrica d-flex align-items-center justify-content-center">
    //           <img
    //             src={brandIcon}
    //             width="45px"
    //             data-toggle="tooltip"
    //             data-placement="right"
    //             title={title}
    //           />
    //         </a>
    //         <span className="logo_title">{title}</span>
    //       </div>

    //       <div class="main-icon-menu-body">
    //         <div class="position-reletive h-100 px-3">
    //           <h6 class="menu-heading">HOME</h6>
    //           <ul class="nav nav-tabs" role="tablist" id="tab-menu">
    //             {menuList}
    //             {/* <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Authentication" data-bs-trigger="hover">
    //                         <a href="#MetricaDashboard" id="dashboard-tab" class="nav-link">
    //                         <span  class="nav-icon">  <i class="ti ti-smart-home menu-icon"></i></span>
    //                         <span class="nav-title">Dashboard</span>
    //                       </a>
    //                   </li> */}
    //           </ul>
    //           <div class="separator"></div>
    //           <h6 class="menu-heading">SETTINGS</h6>
    //           <ul class="nav nav-tabs" role="tablist" id="tab-menu">
    //             {settingsList}
    //             {/* <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Authentication" data-bs-trigger="hover">
    //                         <a href="#MetricaDashboard" id="dashboard-tab" class="nav-link">
    //                         <span  class="nav-icon">  <i class="ti ti-smart-home menu-icon"></i></span>
    //                         <span class="nav-title">Dashboard</span>
    //                       </a>
    //                   </li> */}
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <div class="main-menu-inner">
    //       <div class="topbar-left">
    //           <a href="index.html" class="logo">
    //               <span>
    //               {title}
    //               </span>
    //           </a>
    //       </div>
    //       <div class="menu-body navbar-vertical tab-content">
    //             <div class="position-reletive h-100">
    //                     <ul class="nav nav-tabs" role="tablist" id="tab-menu">
    //                         <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard" data-bs-trigger="hover">
    //                             <div class="title-box">
    //                                  <h6 class="menu-title">Dashboard</h6>
    //                             </div>
    //                         </li>
    //                         <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Apps" data-bs-trigger="hover">
    //                             <div class="title-box">
    //                                  <h6 class="menu-title">Dashboard</h6>
    //                             </div>
    //                         </li>

    //                         <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Uikit" data-bs-trigger="hover">
    //                             <div class="title-box">
    //                                  <h6 class="menu-title">Dashboard</h6>
    //                             </div>
    //                         </li>

    //                         <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Pages" data-bs-trigger="hover">
    //                             <div class="title-box">
    //                                  <h6 class="menu-title">Dashboard</h6>
    //                             </div>
    //                         </li>

    //                         <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Authentication" data-bs-trigger="hover">
    //                             <div class="title-box">
    //                                  <h6 class="menu-title">Dashboard</h6>
    //                             </div>
    //                         </li>
    //                     </ul>
    //                 </div>
    //           <div id="MetricaDashboard" class="main-icon-menu-pane tab-pane">
    //               <div class="title-box">
    //                   <h6 class="menu-title">Dashboard</h6>
    //               </div>

    //               <ul class="nav flex-column">
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="index.html">Analytics</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="crypto-index.html">Crypto</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="crm-index.html">CRM</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="projects-index.html">Project</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="ecommerce-index.html">Ecommerce</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="helpdesk-index.html">Helpdesk</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="hospital-index.html">Hospital</a>
    //                   </li>
    //               </ul>
    //           </div>

    //           <div id="MetricaApps" class="main-icon-menu-pane tab-pane" role="tabpanel"
    //               aria-labelledby="apps-tab">
    //               <div class="title-box">
    //                   <h6 class="menu-title">Apps</h6>
    //               </div>

    //               <div class="collapse navbar-collapse" id="sidebarCollapse">
                      
    //                   <ul class="navbar-nav">
    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarAnalytics" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarAnalytics">
    //                               Analytics
    //                           </a>
    //                           <div class="collapse " id="sidebarAnalytics">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a href="analytics-customers.html" class="nav-link ">Customers</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a href="analytics-reports.html" class="nav-link ">Reports</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarCrypto" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarCrypto">
    //                               Crypto
    //                           </a>
    //                           <div class="collapse " id="sidebarCrypto">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crypto-exchange.html">Exchange</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crypto-wallet.html">Wallet</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crypto-news.html">Crypto News</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crypto-ico.html">ICO List</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crypto-settings.html">Settings</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarCRM" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarCRM">
    //                               CRM
    //                           </a>
    //                           <div class="collapse " id="sidebarCRM">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crm-contacts.html">Contacts</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crm-opportunities.html">Opportunities</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crm-leads.html">Leads</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="crm-customers.html">Customers</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarProjects" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarProjects">
    //                               Projects
    //                           </a>
    //                           <div class="collapse " id="sidebarProjects">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-clients.html">Clients</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-team.html">Team</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-project.html">Project</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-task.html">Task</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-kanban-board.html">Kanban Board</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-chat.html">Chat</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-users.html">Users</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="projects-create.html">Project Create</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarEcommerce" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarEcommerce">
    //                               Ecommerce
    //                           </a>
    //                           <div class="collapse " id="sidebarEcommerce">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ecommerce-products.html">Products</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ecommerce-product-list.html">Product List</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ecommerce-product-detail.html">Product Detail</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ecommerce-cart.html">Cart</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ecommerce-checkout.html">Checkout</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarHelpdesk" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarHelpdesk">
    //                               Helpdesk
    //                           </a>
    //                           <div class="collapse " id="sidebarHelpdesk">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="helpdesk-teckets.html">Tickets</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="helpdesk-reports.html">Reports</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="helpdesk-agents.html">Agents</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarHospital" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarHospital">
    //                               Hospital
    //                           </a>
    //                           <div class="collapse " id="sidebarHospital">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a href="#sidebarAppointments " class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarAppointments">
    //                                           Appointments 
    //                                       </a>
    //                                       <div class="collapse " id="sidebarAppointments">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-doctor-shedule.html">Dr. Shedule</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-appointments.html">All Appointments</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a href="#sidebarDoctors" class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarDoctors">
    //                                           Doctors
    //                                       </a>
    //                                       <div class="collapse" id="sidebarDoctors">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-doctors.html">All Doctors</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-add-doctor.html">Add Doctor</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-doctor-edit.html">Doctor Edit</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-doctor-profile.html">Doctor Profile</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>

    //                                   <li class="nav-item">
    //                                       <a href="#sidebarPatients" class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarPatients">
    //                                           Patients
    //                                       </a>
    //                                       <div class="collapse" id="sidebarPatients">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-patients.html">All Patients</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-add-patient.html">Add Patient</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-patient-edit.html">Patient Edit</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-patient-profile.html">Patient Profile</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>

    //                                   <li class="nav-item">
    //                                       <a href="#sidebarPayments" class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarPayments">
    //                                           Payments
    //                                       </a>
    //                                       <div class="collapse" id="sidebarPayments">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-payments.html">All Payments</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-payment-invoice.html">Payment Invoice</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-cashless-payments.html">Cashless Payments</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>

    //                                   <li class="nav-item">
    //                                       <a href="#sidebarStaff" class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarStaff">
    //                                           Staff
    //                                       </a>
    //                                       <div class="collapse" id="sidebarStaff">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-staff.html">All Staff</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-add-member.html">Add Member</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-edit-member.html">Edit Member</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-member-profile.html">Member Profile</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-salary.html">Staff Salary</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>

    //                                   <li class="nav-item">
    //                                       <a href="#sidebarGeneral" class="nav-link" data-bs-toggle="collapse"
    //                                           role="button" aria-expanded="false" aria-controls="sidebarGeneral">
    //                                           General
    //                                       </a>
    //                                       <div class="collapse" id="sidebarGeneral">
    //                                           <ul class="nav flex-column">
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-all-rooms.html">Room Allotments</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-expenses.html">Expenses Report</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-departments.html">Departments</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-insurance-company.html">Insurance Co.</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-events.html">Events</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-leaves.html">Leaves</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-holidays.html">Holidays</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-attendance.html">Attendance</a>
    //                                               </li>
    //                                               <li class="nav-item">
    //                                                   <a class="nav-link" href="hospital-chat.html">Chat</a>
    //                                               </li>
    //                                           </ul>
    //                                       </div>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarEmail" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarEmail">
    //                               Email
    //                           </a>
    //                           <div class="collapse " id="sidebarEmail">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="apps-email-inbox.html">Inbox</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="apps-email-read.html">Read Email</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="apps-chat.html">Chat</a>
    //                       </li>
    //                       <li class="nav-item">
    //                           <a class="nav-link" href="apps-contact-list.html">Contact List</a>
    //                       </li>
    //                       <li class="nav-item">
    //                           <a class="nav-link" href="apps-calendar.html">Calendar</a>
    //                       </li>
    //                       <li class="nav-item">
    //                           <a class="nav-link" href="apps-invoice.html">Invoice</a>
    //                       </li>
    //                   </ul>
    //               </div>
    //           </div>

    //           <div id="MetricaUikit" class="main-icon-menu-pane  tab-pane" role="tabpanel"
    //               aria-labelledby="uikit-tab">
    //               <div class="title-box">
    //                   <h6 class="menu-title">UI Kit</h6>
    //               </div>
    //               <div class="collapse navbar-collapse" id="sidebarCollapse_2">
                  
    //                   <ul class="navbar-nav">
    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarElements" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarElements">
    //                           UI Elements
    //                           </a>
    //                           <div class="collapse " id="sidebarElements">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-alerts.html">Alerts</a>
    //                                   </li> 
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-avatar.html">Avatar</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-buttons.html">Buttons</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-badges.html">Badges</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-cards.html">Cards</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-carousels.html">Carousels</a>
    //                                   </li>                                
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-dropdowns.html">Dropdowns</a>
    //                                   </li>                                   
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-grids.html">Grids</a>
    //                                   </li>                                
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-images.html">Images</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-list.html">List</a>
    //                                   </li>                                   
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-modals.html">Modals</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-navs.html">Navs</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-navbar.html">Navbar</a>
    //                                   </li> 
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-paginations.html">Paginations</a>
    //                                   </li>   
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-popover-tooltips.html">Popover & Tooltips</a>
    //                                   </li>                                
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-progress.html">Progress</a>
    //                                   </li>                                
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-spinners.html">Spinners</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-tabs-accordions.html">Tabs & Accordions</a>
    //                                   </li>                               
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-typography.html">Typography</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="ui-videos.html">Videos</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarAdvancedUI" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarAdvancedUI">
    //                               Advanced UI
    //                           </a>
    //                           <div class="collapse " id="sidebarAdvancedUI">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-animation.html">Animation</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-clipboard.html">Clip Board</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-dragula.html">Dragula</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-files.html">File Manager</a>
    //                                   </li> 
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-highlight.html">Highlight</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-rangeslider.html">Range Slider</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-ratings.html">Ratings</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-ribbons.html">Ribbons</a>
    //                                   </li>                                  
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-sweetalerts.html">Sweet Alerts</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="advanced-toasts.html">Toasts</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarForms" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarForms">
    //                               Forms
    //                           </a>
    //                           <div class="collapse " id="sidebarForms">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-elements.html">Basic Elements</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-advanced.html">Advance Elements</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-validation.html">Validation</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-wizard.html">Wizard</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-editors.html">Editors</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-uploads.html">File Upload</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="forms-img-crop.html">Image Crop</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarCharts" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarCharts">
    //                           Charts
    //                           </a>
    //                           <div class="collapse " id="sidebarCharts">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="charts-apex.html">Apex</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="charts-justgage.html">JustGage</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="charts-chartjs.html">Chartjs</a>
    //                                   </li> 
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="charts-toast-ui.html">Toast</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarTables" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarTables">
    //                               Tables
    //                           </a>
    //                           <div class="collapse " id="sidebarTables">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="tables-basic.html">Basic</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="tables-datatable.html">Datatables</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="tables-editable.html">Editable</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarIcons" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarIcons">
    //                           Icons
    //                           </a>
    //                           <div class="collapse " id="sidebarIcons">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="icons-materialdesign.html">Material Design</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="icons-fontawesome.html">Font awesome</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="icons-tabler.html">Tabler</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="icons-feather.html">Feather</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarMaps" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarMaps">
    //                               Maps
    //                           </a>
    //                           <div class="collapse " id="sidebarMaps">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="maps-google.html">Google Maps</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="maps-leaflet.html">Leaflet Maps</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="maps-vector.html">Vector Maps</a>
    //                                   </li> 
    //                               </ul>
    //                           </div>
    //                       </li>

    //                       <li class="nav-item">
    //                           <a class="nav-link" href="#sidebarEmailTemplates" data-bs-toggle="collapse" role="button"
    //                               aria-expanded="false" aria-controls="sidebarEmailTemplates">
    //                               Email Templates
    //                           </a>
    //                           <div class="collapse " id="sidebarEmailTemplates">
    //                               <ul class="nav flex-column">
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="email-templates-basic.html">Basic Action Email</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="email-templates-alert.html">Alert Email</a>
    //                                   </li>
    //                                   <li class="nav-item">
    //                                       <a class="nav-link" href="email-templates-billing.html">Billing Email</a>
    //                                   </li>
    //                               </ul>
    //                           </div>
    //                       </li>
    //                   </ul>
    //               </div>
    //           </div>

    //           <div id="MetricaPages" class="main-icon-menu-pane tab-pane" role="tabpanel" aria-labelledby="pages-tab">
    //               <div class="title-box">
    //                   <h6 class="menu-title">Pages</h6>
    //               </div>
    //               <ul class="nav flex-column">
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-profile.html">Profile</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-tour.html">Tour</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-timeline.html">Timeline</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-treeview.html">Treeview</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-starter.html">Starter Page</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-pricing.html">Pricing</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-blogs.html">Blogs</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-faq.html">FAQs</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="pages-gallery.html">Gallery</a>
    //                   </li>
    //               </ul>
    //           </div>

    //           <div id="MetricaAuthentication" class="main-icon-menu-pane tab-pane" role="tabpanel"
    //               aria-labelledby="authentication-tab">
    //               <div class="title-box">
    //                   <h6 class="menu-title">Authentication</h6>
    //               </div>
    //               <ul class="nav flex-column">
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-login.html">Log in</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-login-alt.html">Log in alt</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-register.html">Register</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-register-alt.html">Register-alt</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-recover-pw.html">Re-Password</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-recover-pw-alt.html">Re-Password-alt</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-lock-screen.html">Lock Screen</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-lock-screen-alt.html">Lock Screen-alt</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-404.html">Error 404</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-404-alt.html">Error 404-alt</a>
    //                   </li>
    //                   <li class="nav-item">blank
    //                       <a class="nav-link" href="auth-500.html">Error 500</a>
    //                   </li>
    //                   <li class="nav-item">
    //                       <a class="nav-link" href="auth-500-alt.html">Error 500-alt</a>
    //                   </li>
    //               </ul>
    //           </div> 
    //       </div>
    //   </div> */}
    //   </div>
    );
  }

  //   isPathActive(path) {
  //     return (window.location.href.search(path) !== -1);
  //   }

  //   componentDidMount() {
  //     this.onRouteChanged();
  //     // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
  //     const body = document.querySelector('body');
  //     document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

  //       el.addEventListener('mouseover', function () {
  //         if (body.classList.contains('sidebar-icon-only')) {
  //           el.classList.add('hover-open');
  //         }
  //       });
  //       el.addEventListener('mouseout', function () {
  //         if (body.classList.contains('sidebar-icon-only')) {
  //           el.classList.remove('hover-open');
  //         }
  //       });
  //     });
  //   }
}

export default Sidebar;
//export default withRouter(Sidebar);
