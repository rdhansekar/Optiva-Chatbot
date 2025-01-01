import React from "react";
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {  toast } from 'react-toastify';

var AccountSettings;


export  function getUserDetails(){
  var data= getFromSessionStorage("USER_ACCOUNT_DATA");
  if(data){
    return data.accountDetails;
  }
}

export function saveToSessionStorage(name,data){
  sessionStorage.setItem(name, JSON.stringify(data));
}

export function clearSessionstorage(){
  sessionStorage.clear();
}

export function getFromSessionStorage(name){
  var data = sessionStorage.getItem(name);
  if(data){
    return JSON.parse(data);
  }
  return null;
}

export function setAccountsettings(settings){
  AccountSettings = settings;
  saveToSessionStorage("USER_ACCOUNT_DATA",AccountSettings)
}

export function setAccProfileDetails(accsettings){
   AccountSettings.accountDetails = accsettings;
   setAccountsettings(AccountSettings);
}

export  function getDEPsettings(){
  if(AccountSettings){
    return AccountSettings.DepSettings;
  }else{
    var data = getFromSessionStorage("USER_ACCOUNT_DATA");
    if(data){
      AccountSettings = data;
      return data.DepSettings;
    }
  }
}

export  function getAccountsettings(){
  if(AccountSettings){
    return AccountSettings.accountDetails;
  }else{
    var data = getFromSessionStorage("USER_ACCOUNT_DATA");
    if(data){
      AccountSettings = data;
      return data.accountDetails;
    }
  }
}

export  function getBranding(){
  if(AccountSettings){
    return AccountSettings.branding;
  }
  else{
    var data = getFromSessionStorage("USER_ACCOUNT_DATA");
    if(data){
      AccountSettings = data;
      return data.branding;
    }
  }
}


export  var notification = {
  showInfoMessage : function(messg){
    toast.info(messg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  },
  showSuccessMessage:function(messg){
    toast.success(messg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  },
  showErrorMessage:function(messg){
    toast.error(messg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  },
  showConfirmDialogue:function(title,message,ok,notok){
    var options = {
      title: title,
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: ok,
          class:'btn btn-sm btn-danger me-2'
        },
        {
          label: 'No',
          onClick: notok,
          class:'btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        }
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      keyCodeForClose: [8, 32],
    };
    confirmAlert(options);
  }
}


 
export function deleteUserDetail(){
    sessionStorage.clear();
}


export function downloadURI(data,name ) {
    var bb = new Blob([data ], { type: 'text/xml' });
    var a = document.createElement('a');
    a.download = name;
    a.href = window.URL.createObjectURL(bb);
    a.click();
  }

  export function getDate(d){
    Moment.locale('en');
    return Moment(d).format('DD-MM-YYYY');
  }

  export function formatDate(d , pattern=null){
    Moment.locale('en');
    if(pattern){
      return Moment(d).format(pattern);
    }else{
      return Moment(d).format('DD MMM YYYY');
    }
   
  }
  export function formatTime(d){
    Moment.locale('en');
    return Moment(d).format('hh:mm:ss a');
  }

  export function formatDateTime(d , pattern=null){
    Moment.locale('en');
    if(pattern){
      return Moment(d).format(pattern);
    }else{
      return Moment(d).format('DD MMM yyyy hh:mm:ss a');
    }
   
  }

  export var options = {
    render: (message, onConfirm, onCancel) => {
      return (
          <div class="modal">
            <div class="dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{message.title}</h5>
                  <button onClick={onCancel} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                <i class="fa-solid fa-circle-exclamation"></i>
                  <p>{message.body}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-primary btn-popup" onClick={onCancel} data-dismiss="modal">Cancel</button>
                  <button type="button"  onClick={onConfirm}  className={`btn btn-danger btn-popup ${message.isConfirm ? "hide": "" }`}>Delete</button>
                  <button type="button"  onClick={onConfirm}  className={`btn btn-primary btn-popup ${message.isConfirm ? "": "hide" }`} >Confirm</button>
                </div>
              </div>
            </div>
        </div>
      );
    }
  };
