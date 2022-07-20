
const Logout = (props) => {
  localStorage.removeItem("currentUser");
  window.location = "/";
  return <div></div>;
};

export default Logout;
