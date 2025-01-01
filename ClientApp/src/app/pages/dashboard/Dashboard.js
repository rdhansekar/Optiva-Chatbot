import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Doughnut, Pie, PolarArea, Bar, Line } from 'react-chartjs-2'
import { deleteData, getData, postdata, putdata } from '../../../service/httputlity'
import { getAccountsettings } from '../../../service/utility'
import {
  ChartsWidget1,
  ChartsWidget2,
  ChartsWidget3,
  ChartsWidget4,
  ChartsWidget5,
  ChartsWidget6,
  ChartsWidget7,
  ListsWidget5,
  MixedWidget10,
  MixedWidget11,
  MixedWidget13,
  MixedWidget14,
  MixedWidget15,
  MixedWidget5,
  StatisticsWidget5,
} from '../../../_metronic/partials/widgets'
import { KTSVG } from '../../../_metronic/helpers'
import { Dropdown1 } from '../../../_metronic/partials'
import './Dashboard.scss'
import { CountryList, getAllSettings, IsFeatureAllowed, UsersList } from '../../../service/taskservice'
import { Link } from 'react-router-dom'
import { Mixed } from '../../modules/widgets/components/Mixed'
import { List } from 'rsuite'
import { Lists } from '../../modules/widgets/components/Lists'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default class Dashboard extends React.Component {
  state = {
    PlanCount:0,
    ConsoleLogs:0,
    CanReqCount:0
  }


  initMenu() {
    getData('ConsoleLogs/getproductcount').then((d) => {
      this.setState({
        PlanCount:d.planCount,
        CanReqCount:d.canReqCount,
        ConsoleLogs:d.planCount,
      })
    })
  }

  componentDidMount() {
    this.initMenu();
    
  }


  sidebarItemsClicked(id) {
    this.setState({ selectedChild: id })
  }

  
  render() {
   return (
      <>
        <div className='row g-5 g-xl-8'>
            <div className='col-xl-4'>
                <MixedWidget10 className='card-xl-stretch mb-xl-8' backGroundColor='rgb(203, 240, 244)'    
            chartColor='primary'
            chartHeight='150px' Count={this.state.PlanCount} />
              </div>
              <div className='col-xl-4'>
                <MixedWidget13 className='card-xl-stretch mb-xl-8' backGroundColor='rgb(247, 217, 227)' chartHeight='115px' Count={this.state.CanReqCount} />
              </div>
              <div className='col-xl-4'>
                <MixedWidget14 className='card-xl-stretch mb-xl-8' backGroundColor='rgb(203, 212, 244)' chartHeight='100px' Count={this.state.ConsoleLogs}/>
              </div>
          </div>
          <div className='row g-5 g-xl-8'>
            <div className='col-xl-8 col-lg-6'>
            <div class="card card-xl-stretch mb-xl-8">
                <div class="card-body d-flex flex-column justify-content-between bgi-no-repeat bgi-size-cover bgi-position-x-center p-4" >                
                  <img class="mx-auto theme-light-show w-100" src="/media/illustrations/productBundle.png" alt="" />
                </div>
              </div>
          
            </div>
            <div className='col-xl-4 col-lg-6'>
            <div class="card card-xl-stretch mb-xl-8">
                <div class="card-body d-flex flex-column justify-content-between mt-9 bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0" >
                
                    <div class="fs-2 fs-xl-1 fw-bold text-gray-800 text-center mb-13">
                    <span class="me-2">Add Canned Requests to chatbot<br />
                    <span class="position-relative d-inline-block text-danger">
                      <span class="text-danger opacity-75-hover"><a href="/home/cannedRequest">Get quick replies</a></span>
                      <span class="position-absolute opacity-15 bottom-0 start-0 border-4 border-danger border-bottom w-100"></span></span>
                  </span>to common questions</div>
                  <div class="text-center">
                    {/* <a href="#" className='btn btn-danger'>Add Now</a> */}
                  <img class="mx-auto h-200px h-lg-200px canReqImg theme-light-show" src="/media/illustrations/sigma-1/6.png" alt="" />
                  </div>
                
                </div>
              </div>
             
           {/*  <div>
              <MixedWidget5
                className='card-xl-stretch mb-xl-8'
                image='/media/svg/brand-logos/plurk.svg'
                time='7 hours ago'
                title='Latest canned Request'
                description='Pitstop creates quick email campaigns.<br/>We help to strengthen your brand<br/>for your every purpose.'
              />

              <MixedWidget5
                className='card-xl-stretch mb-xl-8'
                image='/media/svg/brand-logos/telegram.svg'
                time='10 days ago'
                title='Latest console logs'
                description='visualpltform uses the latest and greatest frameworks<br/>with ReactJS for complete modernization and<br/>future.'
              /> 
            </div>*/}
          </div>
          </div>
      </>
    )
  }
}
