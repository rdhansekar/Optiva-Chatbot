import Axios from "axios";
import { serverDNS } from "./contants";

Axios.defaults.withCredentials = true;
var defaultheader = {
    'dataType': 'json',
    'Content-Type': 'application/json',
    withCredentials: false
  };

export var showLoadingIndicator = false;

function checkError(e) {
    if (e && e.response && e.response.status === 401 && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
    }
}

export function putdata(url,data){
    showLoadingIndicator = true;
    return new Promise((resolve, reject) => {
        Axios.put(serverDNS + "api/" + url, data,defaultheader).then(response=>{ 
            showLoadingIndicator = false;
            var d = response.data;
            try {
                if (d)
                    d = JSON.parse(d)
            }
            catch (e) { }
            resolve(d);
        }, (err) => {
            showLoadingIndicator = false;
            checkError(err);
            reject(err);
        });
    });
}


export function postdata(url,data){
    showLoadingIndicator = true;
    return new Promise((resolve, reject) => {
        Axios.post(serverDNS + "api/" +  url, data,defaultheader).then(response=>{ 
            showLoadingIndicator = false;
            var d = response.data;
            try {
                if (d)
                    d = JSON.parse(d)
            }
            catch (e) { }
            resolve(d);
        }, (err) => {
            showLoadingIndicator = false;
            checkError(err);
            reject(err);
        });
    });
}

 
export function getData(url){
    showLoadingIndicator = true;
    return new Promise((resolve, reject) => {
        Axios.get(serverDNS + "api/"  + url,defaultheader).then(response=>{
            showLoadingIndicator = false;
            var d = response.data;
            try {
                if (d)
                    d = JSON.parse(d)
            }
            catch (e) { }
            resolve(d);
        }, (err) => {
            showLoadingIndicator = false;
            checkError(err);
            reject(err);
        });
    });
 }
 
 export function deleteData(url){
    showLoadingIndicator = true;
    return new Promise((resolve, reject) => {
        Axios.delete(serverDNS + "api/"  + url,defaultheader).then(response=>{
            showLoadingIndicator = false;
            var d = response.data;
            try {
                if (d)
                    d = JSON.parse(d)
            }
            catch (e) { }
            resolve(d);
        }, (err) => {
            showLoadingIndicator = false;
            checkError(err);
            reject(err);
        });
    });
}

export function uploadFile(url, file, id) {
    showLoadingIndicator = true;
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        // Update the formData object
        formData.append(
            "File",
            file
        );
        formData.append("FileName", file.name);
        formData.append("Id",id)
        // Request made to the backend api
        // Send formData object
        Axios.post(serverDNS + "api/" + url, formData).then(response => {
            showLoadingIndicator = false;
            var d = response.data;
            try {
                if (d)
                    d = JSON.parse(d)
            }
            catch (e) { }
            resolve(d);
        }, (err) => {
            showLoadingIndicator = false;
            checkError(err);
            reject(err);
        });
    });
}


