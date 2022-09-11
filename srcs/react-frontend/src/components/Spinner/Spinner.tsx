const SpinnerPage = (props: { className: string }) => {
  return (
    <>
      <div className={props.className} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}

export default SpinnerPage;