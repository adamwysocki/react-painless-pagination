// index.test.js
import React from "react";
import PainlessPagination from "./index";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render, mount } from "enzyme";
import sinon, { stub } from "sinon";
import Adapter from "enzyme-adapter-react-16";

// React 16 Enzyme Adapter
Enzyme.configure({ adapter: new Adapter() });

it("should render", () => {
  const onStateSelect = stub();
  const component = renderer.create(<PainlessPagination />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
