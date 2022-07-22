const AlertPage = (props: { type: string, text: string}) => {
    return (
      <>
        <div className={"alert " + props.type} role="alert">
            { props.text }
        </div>
      </>
    );
  }
  
  export default AlertPage;