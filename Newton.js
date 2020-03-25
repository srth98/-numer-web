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
var fx = [] 

class App extends Component{
    state = {
        collapsed: false,
    };
    componentDidMount() {
        fetch("/newton")
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
    this.state={function:" ",X:0,X0 : 0,showGrap:false,showTable:false,items: []}
    this.onChangefunction = this.onChangefunction.bind(this)
    this.onChangeVariableX0 = this.onChangeVariableX0.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onExample = this.onExample.bind(this)
}
onChangefunction (func){
    this.setState({function:func.target.value})
    console.log(this.state.function);
}
onChangeVariableX0 = (event) =>{
    this.setState({X0 : event.target.value})
}
onExample(){
    this.componentDidMount();
    this.setState({function: this.state.items.Function,
    X0: this.state.items.X0,})
}
onSubmit(){
        dataInTable=[]
        var sum = parseFloat(0.000000)
        var n = 0
        var xold,X0 = this.state.X0 ,xnew,xdif
        var inputy = []
        inputy['X1'] = []
        inputy['X2'] = []
        inputy['error'] = []

        inputy['X1'][n] = parseFloat(X0)
        inputy['error'][n] = "-"
        fx[n] = this.funcChange(X0)
        xold = X0-(this.funcChange(X0)/this.funcDiff(X0))
        inputy['X2'][n] = xold
        do{
            inputy['X1'][n+1] = xold
            fx[n+1] = this.funcChange(xold)
            xnew = (xold)-(this.funcChange(xold)/this.funcDiff(xold))
            inputy['X2'][n+1] = xnew
            sum = this.funcError(xnew,xold)
            xold = xnew
            inputy['error'][n+1] = sum
            n++;
        }while (sum > 0.000001)
        this.setState({showGrap:true,showTable:true})
        this.Graph(inputy['X1'])
        this.createTable(inputy['X1'],inputy['X2'], inputy['error']);

}

    funcChange = (X) => {let scope = {x : parseFloat(X)};var expr = compile(this.state.function);return expr.evaluate(scope)}
    funcDiff = (X) => {let scope = {x : parseFloat(X)};var expr = derivative(this.state.function,'x');return expr.evaluate(scope)}
    funcError = (Xnew,Xold) => {return abs((Xnew - Xold)/Xnew)}
    createTable(X1,X2,error) {
    for (var i = 0; i < error.length; i++) {
        dataInTable.push({
            iteration: i,
            x: X1[i],
            x1:X2[i],
            error: error[i],
        });
    }
}
Graph(X1){
    data = [
    {
        type: 'scatter',  
        x: X1,   
        y: fx,     
        marker: {         
            color: '#00FFFF'
        },
        name:'X'
    }
    ];
    
}
    render(){
        {
        var fx = this.state.function
        let layout = {                     
            title: 'One-Point',  
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
            <h1>Newton</h1>
            <br /><br />
            <div className="input-div">
                <form >
                    <label >Function : </label>
                    <input type="text"  placeholder="Enter Function" onChange={this.onChangefunction}/>
    
                    <br/><label >X0 : </label>
                    <input type="text"  placeholder="Enter X0" onChange={this.onChangeVariableX0}/>
                    
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
    width: "80%", background: "#2196f3", color: "#2196f3", float: "inline-start", marginBlockStart: "2%"
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
        title: "Xi",
        dataIndex: "x",
        key: "kx"
    },
    {
        title: "Xi+1",
        dataIndex: "x1",
        key: "kx"
},
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
];