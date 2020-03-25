import React, { Component } from 'react';
import './App.css';
import { Card,Table,Button } from 'antd';
import Headbar from './Headbar';
import './Input.css';
import {range, compile,evaluate,simplify,parse,abs} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
const PlotlyComponent = createPlotlyComponent(Plotly)
var dataInTable = []
var data = []
var fxr = [] , fxl = []


class App extends Component{
    constructor(){
      super();
      this.state={function:" ",Xr:0,Xl:0,X:0,showGrap:false,showTable:false,items: []}
      this.onChangefunction = this.onChangefunction.bind(this)
      this.onChangeVariableXr = this.onChangeVariableXr.bind(this)
      this.onChangeVariableXl = this.onChangeVariableXl.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.onExample = this.onExample.bind(this)
    }
    onChangefunction (func)
    {
      this.setState({function:func.target.value})
      console.log(this.state.function);
    }
    onChangeVariableXr  = (event) =>
    {
        this.setState({Xr:event.target.value})
    }
    onChangeVariableXl = (event) =>
    {
      this.setState({Xl : event.target.value})
    }
    onExample()
    {
      this.componentDidMount();
      this.setState({function: this.state.items.Function,
        Xl: this.state.items.XL,
        Xr: this.state.items.XR})
    }
    onSubmit()
    {
      if(this.state.Xl < this.state.Xr)
      {
          dataInTable=[]
          var sum = parseFloat(0.000000)
          var increaseFunction = false
          var n = 0
          var xm,xl = this.state.Xl , xr = this.state.Xr
          var inputy = []
          inputy['xl'] = []
          inputy['xm'] = []
          inputy['xr'] = []
          inputy['error'] = []
  
          inputy['xl'][n] = parseFloat(xl)
          inputy['xr'][n] = parseFloat(xr)
          xm = (parseFloat(xl) + parseFloat(xr)) / 2
          inputy['xm'][n] = xm
          inputy['error'][n] = "-"
          fxr[n] = this.funcChange(xr)
          fxl[n] = this.funcChange(xl)
          increaseFunction=(((fxr[n])* this.funcChange(xm)) < 0 ?  true : false)
          if(increaseFunction)  
          {
            xl = xm
          }
          else
          {
            xr = xm
          }
  
          do
          {
            inputy['xl'][n+1] = parseFloat(xl)
            inputy['xr'][n+1] = xr
            xm = (parseFloat(xl) + parseFloat(xr)) / 2
            fxr[n+1] = this.funcChange(inputy['xr'][n+1])
            fxl[n+1] = this.funcChange(inputy['xl'][n+1])
            increaseFunction=(((fxr[n+1]) * this.funcChange(xm)) < 0 ?  true : false)
            if(increaseFunction)
            {
              xl = xm
            }
            else
            {
              xr = xm
            }
            sum = this.funcError(xm,inputy['xm'][n])
            inputy['xm'][n+1] = xm
            inputy['error'][n+1] = sum
            n++;
          }while (sum > 0.000001)
          this.setState({showGrap:true,showTable:true})
          this.Graph(inputy['xl'], inputy['xr'])
          this.createTable(inputy['xl'], inputy['xr'], inputy['xm'], inputy['error']);
          }
        
      else
      {
        alert("XL มากกว่า XR")
      }
    }
  
    
    funcChange = (X) => {let scope = {x : parseFloat(X)};var expr = compile(this.state.function);return expr.evaluate(scope)}
    funcError = (Xnew,Xold) => {return abs((Xnew - Xold)/Xnew)}
    createTable(xl, xr, xm, error) {
      for (var i = 0; i < xl.length; i++) {
          dataInTable.push({
              iteration: i,
              xl: xl[i],
              xr: xr[i],
              xm: xm[i],
              error: error[i],
          });
      }
  }
  Graph(xl, xr)
  {
        data = [
        {
          type: 'scatter',  
          x: xl,   
          y: fxl,     
          marker: {         
            color: '#0000FF'
          },
          name:'XL'
        },
        {
        type: 'scatter',  
        x: xr,   
        y: fxr,     
        marker: {         
          color: '#FF0000'
        },
        name:'XR'
      }];
      
    }
        
        render(){
          {
            var fx = this.state.function
            let layout = {                     
              title: 'Bisection',  
              xaxis: {                  
                title: 'X'         
              }
            };
            let config = {
              showLink: false,
              displayModeBar: true
            };
    
        return (
        <div className="App">

        <Headbar/> 
        <h1>Bisection</h1>
        <br /><br />
        <div className="input-div">
            <form >
                <label >Function : </label>
                <input type="text"  placeholder="Enter Function" onChange={this.onChangefunction}/>

                <br/><label >X Left : </label>
                <input type="text"  placeholder="Enter XL" onChange={this.onChangeVariableXl}/>

                <br/><label >X Right : </label>
                <input type="text"  placeholder="Enter XR" onChange={this.onChangeVariableXr}/>
                
                <br/>
                <br/><Button className="input-button" onClick={this.onSubmit} > SUBMIT </Button> 
                <br/><input type="submit" value="TEST CASE"/>
                {/* <div className="button button2">
                    <dd>
                      <Button onClick={this.onSubmit}> Submit </Button>
                      <Button onClick={this.onSubmit}> Test Case </Button>

                    </dd>
                  </div> */}
            </form>
            {this.state.showTable === true ? <Card
                        title={"Bisection Output"}
                        bordered={true}
                        style={tablestyle}
                        id="outputCard"
                    >
                        <Table columns={columns} dataSource={dataInTable} bodyStyle={body}
                        ></Table>
                    </Card>
            :'' }
  {this.state.showGrap === true ? 
  <PlotlyComponent  data={data} Layout={layout} config={config} /> : ''
    }
    </div>  
    </div>
    );
    }
        }
    }

export default App;
var Textstyle = {
    textAlign:'center',
    textDecorationLine:'underline'
  }
  var tablestyle = 
  {
    width: "100%", background: "#2196f3", color: "#2196f3", float: "inline-start", marginBlockStart: "2%"
  }
  var body = {
    fontWeight: "bold", fontSize: "18px", color: "white"
  }
  const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "kiteration"
    },
    {
        title: "XL",
        dataIndex: "xl",
        key: "kxl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "kxr"
    },
    {
        title: "Xm",
        dataIndex: "xm",
        key: "kxm"
    },
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
  ];

