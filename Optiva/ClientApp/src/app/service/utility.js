import React from "react";
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import

import { toast } from 'react-toastify';

export function saveUserDetail(userdata){
    sessionStorage.setItem("userdata", JSON.stringify(userdata));
}


var AccountSettings;

export function setAccountsettings(settings){
  AccountSettings = settings;
}

export  function getAccountsettings(){
  return AccountSettings;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export  var notification = {
  showInfoMessage : function(messg){
    toast.info(messg, {
      position: "top-right",
      autoClose: 5000,
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
      autoClose: 5000,
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
      autoClose: 5000,
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
          onClick: ok
        },
        {
          label: 'No',
          onClick: notok
        }
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
      keyCodeForClose: [8, 32],
    };
    confirmAlert(options);
  }
}


export function getUserdetail(){
    var d= sessionStorage.getItem("userdata");
    return JSON.parse(d);
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

  export function formatDate(d){
    Moment.locale('en');
    return Moment(d).format('DD MMM yyyy');
  }

  export function formatDateTime(d){
    Moment.locale('en');
    return Moment(d).format('DD MMM yyyy hh:mm:ss a');
  }

  export var options = {
    render: (message, onConfirm, onCancel) => {
      return (
          <div class="modal_cust">
            <div class="dialog_cust">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{message.title}</h5>
                  <button onClick={onCancel} type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>{message.body}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary btn-popup" onClick={onCancel} data-dismiss="modal">Cancel</button>
                  <button type="button"  onClick={onConfirm}  className={`btn btn-danger btn-popup ${message.isConfirm ? "hide": "" }`}>Delete</button>
                  <button type="button"  onClick={onConfirm}  className={`btn btn-primary btn-popup ${message.isConfirm ? "": "hide" }`} >Confirm</button>
                </div>
              </div>
            </div>
        </div>
      );
    }
  };