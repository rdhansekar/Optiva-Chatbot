import React from 'react'
import { Link } from 'react-router-dom'
import './BusinessDashboard.scss'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import leadImg from '../../../_metronic/assets/lead_img.png'
import { PageTitle } from '../../../_metronic/layout/core'
import { getData } from '../../../service/httputlity'
import { CountryList, IsFeatureAllowed } from '../../../service/taskservice'
// import * as Funnel from "chartjs-plugin-funnel";
export default class BusinessDashboard extends React.Component {
  state = {
    country:'across_all_countries',
    dataReady: false,
    ProposalProcessedValue: 0,
    'Lead Generation': 0,
    'Proposal': 0,
    'Action': 0,
    'Client Delivery': 0,
    'Complaint': 0,
    'Others': 0,
    TotalTasksCount: 1,
    ProposalStats: {
      labels: ['Deals', 'Processed'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 30],
          backgroundColor: [
            'rgb(97,215,199)',
            'rgb(99 188 231)',
          ],
          borderColor: [
            '#fff',
            '#fff',
          ],
          borderWidth: 1,
        },
      ],
    },
    ProposalsProgressdata: {
      labels: ['Count', 'Deals', 'Ongoing', 'Delayed'],
      datasets: [
        {
          label: 'Proposals',
          data: [30, 10, 8, 5],
          backgroundColor: [
            'rgb(97,215,199)',
            'rgba(80,147,202, 0.8)',
            'rgb(99 188 231)',
            'rgba(244, 98, 117, 0.8)',
          ],
          borderColor: [
            '#fff',
            '#fff',
            '#fff',
            '#fff',
          ],
          borderWidth: 1,
        },
      ],
    },
    top10PeroDataLabel: [],
    top10LaggerDataLabel: [],
    top10PeroData: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: 'Top 10 Performers',
          data: [30, 20, 25, 15, 13, 10, 8, 5, 3, 1],
          backgroundColor: [
            '#50cd89'
          ],
          borderColor: [
            '#fff'
          ],
          borderWidth: 1,
        },
      ],
    },
    top10LagerData: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: 'Top 10 Laggers',
          data: [30, 20, 25, 15, 13, 10, 8, 5, 3, 1],
          backgroundColor: [
            '#38cafd', '#38cafd', '#38cafd', '#38cafd', '#38cafd', '#38cafd', '#38cafd', '#38cafd'
          ],
          borderColor: [
            '#fff'
          ],
          borderWidth: 1,
        },
      ],
    }
  }
  noLegendplugins = {
    legend: {
      display: false
    }
  }
  plugin = {
    maintainAspectRatio: true,
    width: '400',
    height: '400',
    legend: {
      labels: {
        boxHeight: 8,
        boxWidth: 8,
        usePointStyle: true,
        fontColor: '#006192',
      },
      display: true,
      position: 'bottom',
      textAlign: 'bottom',
      fontFamily: 'Allianz-Neo',
      textDirection: 'ltr',
    },
  }

  options = {
    responsive: true,
    plugins: this.plugin,
    onClick: this.graphClick1,
  }
  options1 = {
    responsive: true,
    plugins: this.noLegendplugins,
    onClick: this.graphClick1,
  }

  options3 = {
    responsive: true,
    plugins: this.noLegendplugins,
    onClick: this.graphClick1,
  }
  graphClick1 = this.graphClick1.bind(this)
  graphClick1(evt, element) {
    console.log(evt, element)
    // if (element.length > 0) {
    //   var ind = element[0].index
    //   let url =
    //     'search=' + btoa(evt.chart.config._config.data.labels[ind]) + '&type=' + btoa('OrgLevel')
    //   window.location.href = '/home/tasks?' + url
    // }
  }



  init(){
    this.setState({ dataReady: false });
    getData('businessdashboard?country='+this.state.country).then((d) => {
      console.log(d);
      let totalProposals = 0;
      let onGoingProposals = 0;
      let delayedProposals = 0;
      let TotalTasksCount = this.state.TotalTasksCount
      if (d.CategoryCount && d.CategoryCount.length > 0) {
        d.CategoryCount.forEach(element => {
          if (element._id == "Proposal") {
            totalProposals = element.Count;
            onGoingProposals = element.OnGoing;
            delayedProposals = element.Delayed
          }
          TotalTasksCount += element.Count;
          var j = {
            [element._id]: element.Count
          }
          this.setState(j)
        });
        this.setState({ TotalTasksCount: TotalTasksCount });
      }
      else{
        this.setState({
          ProposalProcessedValue: 0,
          'Lead Generation': 0,
          'Proposal': 0,
          'Action': 0,
          'Client Delivery': 0,
          'Complaint': 0,
          'Others': 0,
          TotalTasksCount: 0})
      }
     
      if (d.ProposalsData && d.ProposalsData.length > 0) {
        let temp = this.state.ProposalStats;
        temp.datasets[0].data = [d.ProposalsData[0].WonCount, d.ProposalsData[0].TotalCount]
        let temp1 = this.state.ProposalsProgressdata;
        temp1.datasets[0].data = [totalProposals, d.ProposalsData[0].WonCount, onGoingProposals, delayedProposals]
        this.setState({
          ProposalProcessedValue: d.ProposalsData[0].TotalValue,
          ProposalStats: temp,
          ProposalsProgressdata: temp1
        })
      }
      else{
        let temp = this.state.ProposalStats;
        temp.datasets[0].data = []
        let temp1 = this.state.ProposalsProgressdata;
        temp1.datasets[0].data = []
        this.setState({
          ProposalProcessedValue: 0,
          ProposalStats: temp,
          ProposalsProgressdata: temp1
        })
      }

      if (d.TopPerformingUsers && d.TopPerformingUsers.length > 0) {
        let top10PeroData = this.state.top10PeroData;
        let top10Labels = d.TopPerformingUsers.map((d, index) => {
          return d._id;
        })
        top10PeroData.datasets[0].data = d.TopPerformingUsers.map((d) => {
          return d.donecount;
        })
        this.setState({ top10PeroData: top10PeroData, top10PeroDataLabel: top10Labels });
      }
      else{
        let top10PeroData = this.state.top10PeroData;
        let top10Labels = []
        top10PeroData.datasets[0].data = []
        this.setState({ top10PeroData: top10PeroData, top10PeroDataLabel: top10Labels });
      }

      if (d.TopNonPerformingUsers && d.TopNonPerformingUsers.length > 0) {
        let top10LagerData = this.state.top10LagerData;
        let top10Labels = d.TopNonPerformingUsers.map((d) => {
          return d._id;
        })
        top10LagerData.datasets[0].data = d.TopNonPerformingUsers.map((d) => {
          return d.Delayedcount;
        })
        this.setState({ top10LagerData: top10LagerData, top10LaggerDataLabel: top10Labels })
      }
      else{
        let top10LagerData = this.state.top10LagerData;
        let top10Labels = []
        top10LagerData.datasets[0].data =[]
        this.setState({ top10LagerData: top10LagerData, top10LaggerDataLabel: top10Labels })
      }
      this.setState({ dataReady: true })
    });
  }

  componentDidMount() {
    this.init()
  }

  render() {
    const businessBreadCrumbs = [
      {
        title: 'Home',
        path: '/home/dashboard',
        isSeparator: false,
        isActive: false,
      },
      {
        title: 'Dashboard',
        path: '',
        isSeparator: true,
        isActive: false,
      },
    ]
    return (
      <>
        <PageTitle breadcrumbs={businessBreadCrumbs}>Business Dashboard</PageTitle>
        <div className={'col-xl-3 col-md-4 col-xs-6  mb-2 d-flex align-items-center justify-content-end'}>
          <label className='mr-3 mb-0 fw-bold'>County</label>
          <select
            className={`btn btn-sm btn-secondary`}
            value={this.state.country}
            onChange={(event) => {
              this.setState({ country: event.target.value })
              setTimeout(() => {
                this.init()
              }, 200)
            }}
          >
            <option value="across_all_countries">Across All Counties</option>
            {CountryList.map((x => {
              return <option value={x.region_name}>{x.region_name}</option>
            }))}
          </select>
        </div>
        <div className='business_dashboard'>
          <div class="row mb-5">
            <div class="col-sm-6 col-xl-3">
              <div class="card card-flush box_shadow1 h-100 justify-content-center">
                <div class="card-heading p-6">
                  <div className='d-flex align-items-center justify-content-between'>
                    <i class="fa-solid fa-money-check-dollar fs-3qx text-primary mr-4"></i>
                    <div class="float-right text-right">
                      <h2 class="text-primary mb-4">$ {this.state.ProposalProcessedValue}</h2>
                      <p class="text-gray-600 mb-0 mt-2 fs-5 fw-bold text_extract w-100">Proposals processed</p>
                    </div>
                    {/* <p class="mt-4 mb-0 text-muted"><b>78% </b>From Last 24 Hours <span class="float-right"><i class="fa fa-caret-up m-r-5"></i>10.25%</span></p> */}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3">
              <div class="card card-flush box_shadow1 h-100 justify-content-center">
                <div class="card-heading p-6">
                  <div className='d-flex align-items-center justify-content-between'>
                    <i class="fa-solid fa-people-roof fs-3qx text-success mr-4"></i>
                    <div class="float-right text-right">
                      <h2 class="text-success mb-4">{this.state['Lead Generation']}</h2>

                      <p class="text-gray-600 mb-0 mt-2 fs-5 fw-bold text_extract w-100">Number of New Leads</p>
                    </div>
                    {/* <p class="mt-4 mb-0 text-muted"><b>62% </b>Orders Last 10 months<span class="float-right"><i class="fa fa-caret-up m-r-5"></i>10.25%</span></p> */}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3">
              <div class="card card-flush box_shadow1 h-100 justify-content-center">
                <div class="card-heading p-6">
                  <div className='d-flex align-items-center justify-content-between'>
                    <i class="fa-solid fa-magnifying-glass-chart fs-3qx text-danger mr-4"></i>
                    <div class="float-right text-right">
                      <h2 class="text-danger mb-4">{this.state['Complaint']}</h2>

                      <p class="text-gray-600 mb-0 mt-2 fs-5 fw-bold text_extract w-100"
                        data-bs-toggle='tooltip'
                        data-bs-trigger='hover'
                        data-bs-dismiss-='click'
                        title='Customer Queries/Complaints'>Customer Queries</p>
                    </div>
                    {/* <p class="mt-4 mb-0 text-muted"><b>42% </b>From Last 24 Hours <span class="float-right"><i class="fa fa-caret-up m-r-5"></i>10.25%</span></p> */}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3">
              <div class="card card-flush box_shadow1 h-100 justify-content-center">
                <div class="card-heading p-6">
                  <div className='d-flex align-items-center justify-content-between'>
                    <i class="fa-solid fa-clipboard-check fs-3qx text-info mr-4"></i>
                    <div class="float-right text-right">
                      <h2 class="text-info mb-4">{this.state['Client Delivery']}</h2>
                      <p class="text-gray-600 mb-0 mt-2 fs-5 fw-bold text_extract w-100">Projects/Deliveries</p>
                    </div>
                    {/* <p class="mt-4 mb-0 text-muted"><b>25% </b>From Last 1 Month <span class="float-right"><i class="fa fa-caret-up m-r-5"></i>10.25%</span></p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-5 mt-8">
            <div class="col-xl-3">
              <div class="card h-100 justify-content-center box_shadow1">
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-5 mb-1'>Proposals - Total Vs. Deals</span>
                  </h3>
                </div>
                <div class="card-body">
                  <div className='chart_div'>
                    {this.state.dataReady ? <Doughnut data={this.state.ProposalStats} width={100} height={50} options={this.options} ></Doughnut> : <></>}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-6">
              <div class="card h-100 justify-content-center box_shadow1">
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-5 mb-1'>Proposals</span>
                  </h3>
                </div>
                <div class="card-body chart_div">
                  {this.state.dataReady ? <Bar data={this.state.ProposalsProgressdata} width={100} height={50} options={this.options3} /> : <></>};
                </div>
              </div>
            </div>
            <div class="col-xl-3">
              <div class="card h-100 justify-content-center box_shadow1">
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-5 mb-1'>Customer Queries</span>
                  </h3>
                </div>
                <div class="card-body chart_div">
                  <svg width="200" height="200">
                    <g transform="rotate(-90 100 100)">
                      <circle r="70" cx="100" cy="100" fill="transparent" stroke="lightgrey" stroke-width="3rem" stroke-dasharray="439.8" stroke-dashoffset="0"></circle>
                      <circle r="70" cx="100" cy="100" fill="transparent" stroke="rgba(248, 175, 35, 0.8)" stroke-width="3rem" stroke-dasharray="439.8" stroke-dashoffset="66">
                      </circle>
                    </g>
                    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle">{(this.state.Complaint && this.state.TotalTasksCount ) ? parseFloat((this.state.Complaint * 100) / this.state.TotalTasksCount).toPrecision(2) : 0}%</text>
                  </svg>
                  {/* <Line data={this.data}  width={100} height={50}/> */}
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-5 mt-8">
            <div class="col-xl-3">
              <div class="card h-100 justify-content-center box_shadow1">
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-5 mb-1'>Leads</span>
                  </h3>
                </div>
                <div class="card-body chart_div position-relative">
                  <img src={leadImg} alt="lead Img" width='100%' className='leadImg' />
                  <label className='leadValue'>{this.state['Lead Generation']}</label>
                  <label className='leadValue leadValue_bottom text_extract'>{(this.state['Lead Generation'] && this.state.TotalTasksCount) ? (this.state['Lead Generation'] * 100 / this.state.TotalTasksCount).toPrecision(2):0}%</label>
                </div>
              </div>
            </div>
            <div class="col-xl-9 row pr-0">
              <div class="col-xl-6">
                <div class="card h-100 justify-content-center box_shadow1">
                  <div className='card-header border-0 pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-5 mb-1'>Top 10 Performers</span>
                    </h3>
                  </div>
                  <div class="card-body chart_div">
                    {this.state.dataReady ?
                      <><Bar data={this.state.top10PeroData} width={100} height={50} options={this.options1} />
                        <div className='top_txt'>Top</div>
                        <marquee class='mt-3' behavior="scroll" scrollamount="5" direction="left" onmouseover="this.setAttribute('scrollamount',0);" onmouseout="this.setAttribute('scrollamount',5);">
                          <div></div>{this.state.top10PeroDataLabel.map((d, index) => {
                            return <><b> {index} : </b><span>{d}</span>  &nbsp;&nbsp; </>
                          })}</marquee></>
                      : <></>}

                  </div>
                </div>
              </div>
              <div class="col-xl-6 pr-0">
                <div class="card h-100 justify-content-center box_shadow1">
                  <div className='card-header border-0 pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-5 mb-1'>Top 10 Laggers</span>
                    </h3>
                  </div>
                  <div class="card-body chart_div">
                    {this.state.dataReady ? <>
                      <Bar data={this.state.top10LagerData} width={100} height={50} options={this.options1} />
                      <div className='top_txt lagger_top_txt'>Top</div>
                      <marquee class='mt-3' behavior="scroll" scrollamount="5" direction="left" onmouseover="this.setAttribute('scrollamount',0);" onmouseout="this.setAttribute('scrollamount',5);"> {this.state.top10LaggerDataLabel.map((d, index) => {
                        return <><b> {index} : </b><span>{d}</span>  &nbsp;&nbsp; </>
                      })} </marquee></> : <></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

    )
  }
}