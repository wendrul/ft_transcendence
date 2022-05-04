import MainNavigation from "./MainNavigation"

export default function Layout(props: any) {
  return (
    <div>
      <MainNavigation/>
      <div>{props.children}</div>
    </div>
  );
}
