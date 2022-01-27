import React from 'react';
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Extent from "@arcgis/core/geometry/Extent";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem } from 'react-bootstrap';

class Welcome extends React.Component {

  state = {
    extent: null,
    view: null, bookmarks: null,
    bookmarkName: "",
    error:""
  };

  componentDidMount() {
    let olddata = localStorage.getItem('formdata');
    let oldArr;
    if (olddata != null) {
      oldArr = JSON.parse(olddata)
      if (oldArr == null || oldArr.filter(a => a.name == this.props.location.user)[0] == undefined || this.props.location.user == undefined) {
        this.props.history.push("/login");
      }
    }
    else
      this.props.history.push("/login");

    this.setState({ bookmarks: oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks })


    const webmap = new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: "e691172598f04ea8881cd2a4adaa45ba"
        //70b726074af04a7e9839d8a07f64c039
        //e691172598f04ea8881cd2a4adaa45ba
      }
    });
    const extent = new Extent({
    });

    const view = new MapView({
      container: "viewDiv",
      map: webmap,
      extent: extent,
    });

    this.setState({ view: view });

    watchUtils.whenTrue(view, "stationary", () => {
      if (view.extent) {
        this.setState({ extent: view.extent });
      }
    });
  }
  onChangeName = (e) => {
    this.setState({ error: "" })

    this.setState({ bookmarkName: e.target.value })
  }

  changeExtent = (bookmarkName) => {
    let currentBookmark =this.state.bookmarks.find(a=>a.name ==bookmarkName)
    this.state.view.extent = new Extent({
      xmin: currentBookmark.xmin,
      ymin: currentBookmark.ymin,
      xmax: currentBookmark.xmax,
      ymax: currentBookmark.ymax,
      spatialReference: {
        wkid: 102100
      }
    });
  }
  DeleteExtent = (bookmarkName) => {
    let olddata = localStorage.getItem('formdata');
    let oldArr = JSON.parse(olddata)
    oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks= this.state.bookmarks.filter(a=>a.name !=bookmarkName)
    this.setState({ bookmarks: this.state.bookmarks.filter(a=>a.name !=bookmarkName) }); 
    localStorage.setItem("formdata", JSON.stringify(oldArr))
    
  }
  addExtent = (e) => {
    
    let olddata = localStorage.getItem('formdata');
    if (this.state.bookmarkName == "") {
      this.setState({ error: "please enter bookmark name"});

    } else {
      let oldArr = JSON.parse(olddata)
      let bookmarks = oldArr.bookmarks;
      let bookmark = this.state.view.extent;

      if (oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks == undefined) {
        oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks = []
      }
      oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks.push({
        name: this.state.bookmarkName,
        xmin: this.state.view.extent.xmin,
        ymin: this.state.view.extent.ymin,
        xmax: this.state.view.extent.xmax,
        ymax: this.state.view.extent.ymax
      })
      this.setState({ bookmarks: oldArr.filter(a => a.name == this.props.location.user)[0].bookmarks })
      localStorage.setItem("formdata", JSON.stringify(oldArr))
    }
    this.setState({ bookmarkName: "" })

  }
  render() {
    return (
      <div className="my-5 mx-2">
        <div className="row">

          <div className="col-6">
            <div id="viewDiv" className=" vh-100"></div>

          </div>
          <div className="col-6">
            <div className="container">


              <div className="d-flex align-items-center justify-content-between">
                <h1>Hello, {this.props.location.user}</h1>

                <LinkContainer to="/login" className="btn btn-primary">
                  <NavItem>Logout</NavItem>
                </LinkContainer>
              </div>
              <p className="error">
          {this.state.error}
        </p>
              <div className="d-flex align-items-center justify-content-around my-3">

                <input type="text" className="form-control mr-2" value={this.state.bookmarkName} onChange={this.onChangeName} required />

                <button className="btn btn-primary " style={{ width: "190px" }} onClick={this.addExtent}>Add bookmark</button>
              </div>
              <ul className="container">
                {this.state.bookmarks?.map((bookmark, index) =>
                  <li key={index} className="d-flex justify-content-between" style={{ marginBottom: "12px", listStyle: "none" ,cursor: 'pointer'}} onClick={() => { this.changeExtent(bookmark.name) }} >
                    {
                      <>
                        <span> - <a >{bookmark.name}</a></span>
                        <button className="btn btn-primary mr-2" onClick={() => { this.DeleteExtent(bookmark.name) }}>Delete bookmark</button>
                      </>
                    }
                  </li>
                )}
              </ul>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome;
