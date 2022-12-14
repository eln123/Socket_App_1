import React from "react";
import { connect } from "react-redux";
import { setSocketOntoRedux } from "../store/socket";
// import { createNewContact } from "../store/contact";
import history from "../history";
import { me } from "../store/auth";
import { Link } from "react-router-dom";

class AddContact extends React.Component {
  constructor() {
    super();
    this.state = {
      contactName: "",
      phoneNumber: "",
      addAContact: true,
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.setState({ ...this.state, addAContact: true });
    const socket = this.props.socket;

    socket.on("contact-added", (message) => {
      console.log(message);
      this.setState({ ...this.state, addAContact: !this.state.addAContact });
    });
  }
  async submitHandler(event) {
    event.preventDefault();
    const userPhoneNumber = this.props.user.phoneNumber;
    let contactNameInput = document.getElementById("contactNameInput");

    let phoneNumberInput = document.getElementById("phoneNumberInput");

    const socket = this.props.socket;
    if (
      this.state.phoneNumber.length > 10 ||
      this.state.phoneNumber.length < 9 ||
      this.state.contactName.length < 1
    )
      return;
    socket.emit(
      "addContact",
      userPhoneNumber,
      this.state.contactName,
      this.state.phoneNumber
    );
    this.state.phoneNumber = "";
    this.state.contactName = "";
    await this.props.loadInitialData();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    let addAContact = this.state.addAContact;
    return addAContact ? (
      <div
        style={{
          height: "80vh",
          width: "50vw",
          borderRadius: "10px",
          border: "1px solid black",
          position: "absolute",
          left: "50%",
          top: "10%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <h1 style={{ textAlign: "center" }}></h1>
        <form
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            height: "90%",
            width: "100%",

            justifyContent: "start",
            fontSize: "24px",
          }}
          onSubmit={this.submitHandler}
        >
          <label style={{ textAlign: "center" }}>Name</label>
          <input
            style={{
              padding: "5px",
              border: "1px solid black",
              width: "20vw",
              alignSelf: "center",
            }}
            id="contactNameInput"
            value={this.state.contactName}
            type="text"
            name="contactName"
            onChange={this.handleChange}
          ></input>
          <label style={{ textAlign: "center" }}>PhoneNumber</label>
          <input
            style={{
              padding: "5px",
              border: "1px solid black",
              width: "20vw",
              alignSelf: "center",
            }}
            id="phoneNumberInput"
            value={this.state.phoneNumber}
            type="text"
            name="phoneNumber"
            onChange={this.handleChange}
          ></input>
          <input
            style={{
              padding: "10px",
              border: "1px solid black",
              marginTop: "10px",
              color: "white",
              fontSize: "28px",
              width: "33vw",
              alignSelf: "center",
              backgroundColor: "rgb(51, 138, 224)",
            }}
            type="submit"
            value="Submit"
          />
        </form>
        <h4
          style={{
            position: "absolute",

            backgroundColor: "red",
            height: "200px",
          }}
          id="addContactSuccess"
        ></h4>
      </div>
    ) : (
      <div
        style={{
          height: "80vh",
          width: "50vw",
          borderRadius: "10px",
          border: "1px solid black",
          position: "absolute",
          left: "50%",
          top: "10%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "35px",
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Successfully Added!
        </h1>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
        >
          <button
            style={{
              width: "250px",
              margin: "auto auto auto auto",
              height: "5vh",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
              backgroundColor: "rgb(51, 138, 224)",
            }}
            onClick={() => {
              this.setState({ ...this.state, addAContact: true });
            }}
          >
            Add another
          </button>
          <button
            style={{
              width: "250px",
              margin: "auto auto 40% auto",

              height: "5vh",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
              backgroundColor: "rgb(51, 138, 224)",
            }}
            onClick={() => history.push("/conversation")}
          >
            Go back to home page
          </button>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.auth,
    socket: state.socket,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

export default connect(mapState, mapDispatch)(AddContact);
