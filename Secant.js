import React, { Component } from 'react';
import './App.css';
import { Card,Table,Button } from 'antd';
import Headbar from './Headbar';
import './Input.css';
import {range, compile,evaluate,simplify,parse,abs,derivative} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'

const PlotlyComponent = createPlotlyComponent(Plotly)
var dataInTable = []
var data = []
var fxg =[]

class App extends Component{
    state = {
        collapsed: false,
    };
    componentDidMount() {
        fetch("/secant")
            .then(res => res.json())
            .then(json => {
            this.setState({ items: json });
            });
        }
    
    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    constructor(){
    super();
    this.state={function:" ",Xr:0,Xl:0,X:0,showGrap:false,showTable:false,items: []}
    this.onChangefunction = this.onChangefunction.bind(this)
    this.onChangeVariableXr = this.onChangeVariableXr.bind(this)
    this.onChangeVariableXl = this.onChangeVariableXl.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onExample = this.onExample.bind(this)
}
onChangefunction (func){
    this.setState({function:func.target.value})
    console.log(this.state.function);
}
onChangeVariableXr  = (event) =>{
    this.setState({Xr:event.target.value})
}
    onChangeVariableXl = (event) =>{
        this.setState({Xl : event.target.value})
    }
onExample(){
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
        var n = 1
        var xm,xl = this.state.Xl , xr = this.state.Xr,xnew,fxr,fxl
        var inputy = []
        inputy['xl'] = []
        inputy['xnew'] = []
        inputy['xr'] = []
        inputy['xg'] = []
        inputy['error'] = []

        
        inputy['xl'][n] = parseFloat(xl)
        inputy['xr'][n] = parseFloat(xr)
        inputy['xg'][n-1] = xl
        inputy['xg'][n] = xr
        inputy['error'][n] = 1
        fxl = this.funcChange(xl)
        fxr = this.funcChange(xr)
        fxg[n-1] = fxl
        fxg[n] = fxr
        inputy['error'][n-1] = 1

        do
        {
            xnew = xr-((fxr*(xl-xr))/(fxl-fxr));
            inputy['xnew'][n]=xnew
            inputy['xg'][n+1]=xnew
            fxg[n+1]=this.funcChange(xnew)
            xl=xr
            xr=xnew
            fxl=this.funcChange(xl)
            fxr = this.funcChange(xr)
            inputy["xl"][n+1] = xl;
            inputy["xr"][n+1] = xr;
            sum = this.funcError(xr,xl);
            inputy["error"][n] = sum;
            n++;
        }while (sum > 0.000001)
        this.setState({showGrap:true,showTable:true})
        this.Graph(inputy['xg'])
        this.createTable(inputy['xl'], inputy['xr'],inputy['xnew'],inputy['error']);
        }
    
    else{
        console.log("Please Input Xl > Xr")
    }
}

    funcChange = (X) => {let scope = {x : parseFloat(X)};var expr = compile(this.state.function);return expr.evaluate(scope)}
    funcError = (Xnew,Xold) => {return abs((Xnew - Xold)/Xnew)}
    createTable(xl, xr,xnew,error) {
    for (var i = 1; i < xnew.length; i++) {
        dataInTable.push({
            iteration: i,
            xl: xl[i],
            xr: xr[i],
            xnew : xnew[i],
            error: error[i],
        });
    }
}
Graph(xg){
    data = [
        {
        type: 'scatter',  
        x: xg,   
        y: fxg,     
        marker: {         
            color: '#0000FF'
        },
        name:'Xi'
        },
    ];
    
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
            <h1>Secant</h1>
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
                            title={"Output"}
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
        title: "Xi-1",
        dataIndex: "xl",
        key: "kxl"
    },
    {
        title: "Xi",
        dataIndex: "xr",
        key: "kxr"
    },
    {
        title: "Xi+1",
        dataIndex: "xnew",
        key: "kxnew"
},
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
];