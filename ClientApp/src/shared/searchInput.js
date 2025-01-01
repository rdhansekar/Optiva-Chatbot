import React, {useState} from 'react'
var data = []

export class SearchInput extends React.Component {
  constructor(props){
    super(props);
  }
  
 handleFilter = function (searchValue) {
    if (searchValue.length === 0) {
      console.log(data)
      return data
    }
    var result = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
        result.push(data[i])
      }
    }
    console.log(result)
    return result
  }

  state = {
    value:'',
    selectedValue:'',
    showSearch:false,
    filterList:[]
  };
  
  handleChange = this.handleChange.bind(this)

   // eslint-disable-next-line no-dupe-class-members
   handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  setSearchField(val){
    this.setState({showSearch:val});
  }
  const [value, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(props.config.value)
  const [showSearch, ] = useState(false);
  const [filterList, setFilterList] = useState([])
 
  render(){
   let result= this.state.filterList.map((d)=>{
        return <p onClick={}>d.value</p>
    })
    return (
        <>
          <label
            onClick={setSearchField(true)}
            name='CompletionTime'
            type='time'
            class='form-control form-control-solid mb-3 mb-lg-0'
            >{props.config.value}</label>
          <input
            onChange={(event) => {
                setValue(event.target.value);
                setFilterList(handleFilter(event.target.value));
            }}
            value={value}
            name="value"
          ></input>
           {result}
        </>
      )
  }
  
}
