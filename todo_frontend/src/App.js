import './App.css';
import React, { Component } from 'react';
import CustomModla from './components/Modal';
import axios from 'axios'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal : false,
      viewCompleted : false,
      activeItem : {
        title : '',
        description : '',
        completed : false
      },
      todoList : [],
    };
  }


  componentDidMount(){
    this.refreshList()
  }


  refreshList = () => {
    axios.get("http://localhost:8000/api/tasks/").then(response => this.setState({todoList : response.data})).catch(error => console.log(error))
  }


  toggle = () => {
    this.setState({modal : !this.state.modal})
  }


  handleSubmit = item => {
    this.toggle()
    if(item.id){
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(response => this.refreshList())
      return;
    }

    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(response => this.refreshList())
  }


  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(response => this.refreshList())
  }


  createItem = () => {
    const item = {title:'', modal:!this.state.modal}
    this.setState({activeItem : item, modal: !this.state.modal})
  }


  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };


  displayCompleted = status => {
    if(status){
      return this.setState({viewCompleted: true});
    }
    return this.setState({viewCompleted: false});
  }


  renderTabList = () => {
    return(
      <div className="my-5 tab-list"> 
        <span onClick={() => this.displayCompleted(true)} className={this.state.viewCompleted ? "active" : ""}>
          Completed 
        </span> 
        <span onClick={() => this.displayCompleted(false)} className={this.state.viewCompleted ? "" : "active"}>
          Incompleted 
        </span> 
      </div> 

    )
  }


  renderItems = () => {
    const {viewCompleted} = this.state
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );  

    return newItems.map(item => (
      <div>
        <div className="card-body">
        <span
            className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todos" : ""
              }`}
            title={item.description}
          >
            {item.title}
          </span>
          <span>
            <button
              onClick={() => this.editItem(item)}
              className="btn btn-secondary mx-2 float-end"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete(item)}
              className="btn btn-danger float-end"
            >
              Delete
            </button>
          </span>
        </div>
        <div className="card-footer text-muted ">
          <h6>Date of Creation : DD/MM/YY</h6>
        </div>
        {/* <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todos" : ""
              }`}
            title={item.description}
          >
            {item.title}
          </span>
          <span>
            <button
              onClick={() => this.editItem(item)}
              className="btn btn-secondary mx-2"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete(item)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </span>
        </li> */}
      </div>
    ));
  }

  render(){
    return(
      <main>
        <h1 className='text-black text-uppercase text-center my-4'>Todo List</h1>
        <div className='row'>
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button className="btn btn-primary" onClick={this.createItem}>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <CustomModla activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit}/>
        ) : null}
      </main>
    )
  }
}

export default App;