import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      error: ''
    }
  }

  onChangeName = (e) => {
    this.setState({ name: e.target.value })
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  onChangePhone = (e) => {
    this.setState({ phone: e.target.value })
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault();
    let ob = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      
    }
    let olddata = localStorage.getItem('formdata');
    let oldArr = JSON.parse(olddata)
    if (oldArr!=null && oldArr.filter(a => a.name == this.state.name)[0] != undefined) {
      this.setState({ error: "this name already registered" });


    } else {


      if (olddata == null) {
        olddata = []
        olddata.push(ob)
        localStorage.setItem('formdata', JSON.stringify(olddata));
      } else {
        let oldArr = JSON.parse(olddata)
        oldArr.push(ob)
        localStorage.setItem("formdata", JSON.stringify(oldArr))
        console.log(oldArr, 'hhg')
      }
      this.props.history.push("/login");

    }

  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="my-5 container">
        <p className="error">
          {this.state.error}
        </p>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={this.state.email} onChange={this.onChangeEmail} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" className="form-control" value={this.state.phone} onChange={this.onChangePhone} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword} required />
        </div>
        <button type="submit" className="btn btn-primary" onClick={this.props.onRegister}>Register</button>
      </form>
    )
  }
}

export default Register;