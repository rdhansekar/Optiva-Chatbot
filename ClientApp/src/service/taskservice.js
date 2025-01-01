import Department from '../app/pages/accounts/department'
import {PermissionTags} from './contants'
import {getData, postdata} from './httputlity'
import {
  getAccountsettings,
  getFromSessionStorage,
  getUserDetails,
  saveToSessionStorage,
  setAccountsettings,
} from './utility'
export var UsersList = []
export var Departments = []
export var CountryList = []

export function subscribeToEvent(eventName, listener) {
  document.addEventListener(eventName, listener)
}

export function unsubscribeOnEvent(eventName, listener) {
  document.removeEventListener(eventName, listener)
}

export function publish(eventName, data) {
  const event = new CustomEvent(eventName, {detail: data})
  document.dispatchEvent(event)
}

export function getAllSettings(force = false) {
  var data = getAccountsettings()
  if (!data || force) {
    getData('getalldefaultdata').then((d) => {
      if (d) {
        setAccountsettings(d)
        publish('USER_DATA_UPDATE', d)
      }
    })
  }
  getUserList()
  getDepartments()
  getRegionsServer();
}

function getRegionsServer() {
  var gridjson = {
    limit: -1,
    skip: 0,
    sort: 'time',
    sortOrder: 'desc',
  }
  postdata('getregions', gridjson).then(
    (d) => {
      CountryList = d.data;
    },
    (e) => {}
  )
}

export function getDepartments() {
  Departments = getFromSessionStorage('DEPARTMENTS');
  if (Departments && Departments.length > 0) {
    return Departments
  } else {
    var gridjson = {
      limit: -1,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
      ParentId: '',
      getType: 'Assigned',
    }
    postdata('getdepartments', gridjson).then(
      (d) => {
        Departments = d.data
        saveToSessionStorage('DEPARTMENTS', d.data)
      },
      (e) => {}
    )
  }
}

export function getUserList() {
  getData('getusersmailid').then((d) => {
    if (d && d.length > 0) {
      UsersList = d
    }
  })
}

export function setUserMailIds(ids) {
  UsersList = ids
}

export function IsFeatureAllowed(feature) {
  var userDetails = getUserDetails()
  if (userDetails) {
    var index = PermissionTags.indexOf(feature) + 1
    if (index > 0 && userDetails.FeaturePermission.indexOf(index + '') !== -1) {
      return true
    }
  }
  return false
}
