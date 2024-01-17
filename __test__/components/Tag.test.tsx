import renderer from "react-test-renderer";
import Tag from "@/components/Tag/Tag";

it("renders correctly", () => {
  const tree = renderer.create(<Tag content="sample tag"></Tag>).toJSON();
  expect(tree).toMatchSnapshot();
});
