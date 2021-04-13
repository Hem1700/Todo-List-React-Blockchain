import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'
import TodoList from './TodoList'
import Svg from './svg/todoList.jpeg';
class App extends React.Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    console.log(network)
    //Fetch the account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    this.setState({ todoList })
    const taskCount = await todoList.methods.taskCount().call()
    this.setState({ taskCount })
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    this.setState({ loading: false })
    console.log(this.state.tasks)
    console.log(todoList)
    console.log(accounts)


  }
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      taskCount: 0,
      tasks: [],
      loading: true,
    };
    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)
  }

  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })

  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })

  }


  render() {
    return (
      <div>
        <div className="container-fluid App_Container">
        <nav className="App__navbar navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow">
          <a className="navbar-brand App__item col-sm-3 col-md-2 mr-0" href="#" target="_blank">Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item  text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div>
                <img src={Svg} className="App__svg" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="App__second-column">
            <main role="main" className="col-lg-12 d-flex ">
              {
                this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <TodoList
                    tasks={this.state.tasks}
                    createTask={this.createTask}
                    toggleCompleted={this.toggleCompleted}
                  />
              }
             
            </main>
            </div>
            </div>
            
        </div>
        {/* <h1>Hello World</h1>
        <p>Your account: {this.state.account}</p>
        <p>Task Count: {this.state.taskCount}</p> */}
        </div>
        </div>
      </div>
    );
  }
}

export default App;
