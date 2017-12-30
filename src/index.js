/* @flow */
import React from "react";
import styled from "styled-components";
import { rgba, rgb } from "polished";

const PainlessPaginationWrapper = styled.div`
  text-align: center;
`;

const PainlessPaginationList = styled.ul`
  list-style: none;
  padding: 8px;
`;

const PainlessPaginationLink = styled.a`
  text-decoration: none;
`;

const PainlessPaginationElement = styled.li`
  border-radius: 50%;
  color: rgba(33, 33, 33, 1);
  display: inline-block;
  margin: 0;
  transition: 0.15s ease-in;
  cursor: pointer;
`;

const PainlessPaginationNumber = PainlessPaginationElement.extend`
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  min-width: 40px;
  padding: 8px 0;
  margin: 0 1px;
  background: ${props => (props.active ? rgb(0, 188, 212) : "white")};
  color: ${props => (props.active ? "white" : rgba(33, 33, 33, 1))};
  vertical-align: middle;
  box-shadow: ${props => (props.active ? "1px 1px #CCCCCC" : "0px")};

  &:hover {
    background: ${props => (props.active ? rgb(0, 188, 212) : rgba(0, 188, 212, 0.12))};
    color: ${props => (props.active ? "white" : rgba(33, 33, 33, 1))};
  }
`;

const PainlessPaginationArrow = PainlessPaginationElement.extend`
  margin-top: 5px;
  vertical-align: middle;
`;

const LeftArrow = () => {
  return (
    <PainlessPaginationArrow>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="rgba(33, 33, 33, 1)" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
      </svg>
    </PainlessPaginationArrow>
  );
};

const RightArrow = () => {
  return (
    <PainlessPaginationArrow>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="rgba(33, 33, 33, 1)" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
      </svg>
    </PainlessPaginationArrow>
  );
};

const pageQueryParams = ["page", "page_num", "pageNum", "page_number", "pageNumber"];

/**
 * Type definition for class props.
 */
type Props = {};

/**
 * React class for state select in a form
 * @class PainlessPagination
 */
class PainlessPagination extends React.Component<Props> {
  /**
   * @memberof PainlessPagination
   * @static
   */
  static defaultProps = {};

  /**
   * @memberof PainlessPagination class.
   * @static
   */
  static propTypes = {};

  renderPaginationRow(currentPage: number, pageCount: number) {
    const paginationVals = [];
    const delta = currentPage < 3 ? 4 : 2;
    const left = currentPage - delta;
    const right = currentPage === 2 ? currentPage + delta : currentPage + delta + 1;
    let result = [];

    result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(i => i && i >= left && i < right);

    for (let x = 0; x < result.length; x++) {
      if (result[x] === currentPage) {
        paginationVals.push(
          <PainlessPaginationLink key={result[x]} href={`/${result[x]}`}>
            <PainlessPaginationNumber active>{result[x]}</PainlessPaginationNumber>
          </PainlessPaginationLink>
        );
      } else {
        paginationVals.push(
          <PainlessPaginationLink key={result[x]} href={`/${result[x]}`}>
            <PainlessPaginationNumber>{result[x]}</PainlessPaginationNumber>
          </PainlessPaginationLink>
        );
      }
    }
    return paginationVals;
  }

  getPaginationInformation() {
    let currentPageNumber = 1;
    let pageNumberQueryParam = null;
    let pathName = window.location.pathname;
    const location = window.location;

    if (location.hasOwnProperty("pathname") && location.pathname) {
      const pathParts = location.pathname.split("/");
      const lastElement = parseInt(pathParts[pathParts.length - 1], 10);
      if (!isNaN(lastElement) && typeof lastElement === "number") {
        currentPageNumber = lastElement;
        pathName = location.pathname.substring(0, location.pathname.length - (currentPageNumber.toString().length + 1));
      } else {
        pathName = location.pathname;
      }
    }

    if (location.hasOwnProperty("search") && location.search) {
      const trimmedSearchString = location.search.substring(1, location.search.length);
      const searchParams = trimmedSearchString.split("&");
      for (let index = 0; index < searchParams.length; index++) {
        const searchElements = searchParams[index].split("=");
        const searchTerm = searchElements[0].toLowerCase();

        if (pageQueryParams.includes(searchTerm)) {
          currentPageNumber = parseInt(searchElements[1]);
          pageNumberQueryParam = searchTerm;
        }
      }
    }
    return { currentPageNumber, pageNumberQueryParam, pathName };
  }

  /**
   * React render method.
   * @memberof PainlessPagination class.
   * @return {string} - HTML markup for the component.
   */
  render() {
    const { currentPageNumber, pageNumberQueryParam, pathName } = this.getPaginationInformation();
    const nextPageNumber = currentPageNumber + 1;
    const previousPageNumber = currentPageNumber > 1 ? currentPageNumber - 1 : currentPageNumber;
    let queryParam = "";
    let forwardSlash = "/";

    if (pageNumberQueryParam) {
      queryParam = `?${pageNumberQueryParam}=`;
      forwardSlash = "";
    }

    return (
      <PainlessPaginationWrapper>
        <PainlessPaginationList>
          <PainlessPaginationLink href={`${pathName}${forwardSlash}${queryParam}${previousPageNumber}`}>
            <LeftArrow />
          </PainlessPaginationLink>
          {this.renderPaginationRow(currentPageNumber, 10)}
          <PainlessPaginationLink href={`${pathName}${forwardSlash}${queryParam}${nextPageNumber}`}>
            <RightArrow />
          </PainlessPaginationLink>
        </PainlessPaginationList>
      </PainlessPaginationWrapper>
    );
  }
}

export default PainlessPagination;
