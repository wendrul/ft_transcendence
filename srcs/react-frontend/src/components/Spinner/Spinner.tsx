const SpinnerPage = (props: { className: string }) => {
  return (
    <>
      <div className={props.className} style={{width: "3rem", height: "3rem"}} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}

export default SpinnerPage;