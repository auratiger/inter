import { render, screen } from "@testing-library/react";
import ComponentGrid from "@/components/home/component-grid";

describe("Home", () => {
  it("should have Docs text", async () => {
    render(<ComponentGrid />);

    const myElem = screen.getAllByText("Content");

    expect(myElem.length).toBeGreaterThan(1);
    expect(myElem[0]).toBeInTheDocument();
  });
});
