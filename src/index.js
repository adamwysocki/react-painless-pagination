/* @flow */
import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
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
  border-radius: ${props => (props.circle ? "50%" : "4%")};
  color: rgba(33, 33, 33, 1);
  display: inline-block;
  margin: 0;
  transition: 0.15s ease-in;
  cursor: pointer;
`;

const PainlessPaginationNumber = PainlessPaginationElement.extend`
  border: ${props => (props.border ? "1px solid #cccccc" : "0px")};
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  min-width: 40px;
  padding: 8px 0;
  margin: 0 3px;
  background: ${props => (props.active ? rgb(0, 188, 212) : "white")};
  color: ${props => (props.active ? "white" : rgba(33, 33, 33, 1))};
  vertical-align: middle;
  box-shadow: ${props => (props.active ? "1px 1px #eeeeee" : "0px")};

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
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="rgba(33, 33, 33, 1)" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
    </svg>
  );
};

const RightArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="rgba(33, 33, 33, 1)" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    </svg>
  );
};

const pageQueryParams = ["page", "page_num", "pageNum", "page_number", "pageNumber"];

/**
 * Type definition for class props.
 * @property {boolean} border - Should border be shown
 * @property {boolean} circle - Should page numbers be shown as circles
 */
type Props = {
  border: boolean,
  circle: boolean,
  enableTransition: boolean,
  currentPage: number,
  totalNumberOfPages: number
};

/**
 * React class for state select in a form
 * @class PainlessPagination
 */
class PainlessPagination extends React.Component<Props> {
  /**
   * @memberof PainlessPagination
   * @static
   * @property border - defaults to false
   * @property circle - defaults to false
   */
  static defaultProps = {
    border: false,
    circle: false,
    enableTransition: true,
    totalNumberOfPages: 2
  };

  /**
   * @memberof PainlessPagination class.
   * @static
   * @prop {bool} border - Should border be shown
   * @prop {bool} cicle - Should page numbers be displayed as circles
   */
  static propTypes = {
    border: PropTypes.bool,
    circle: PropTypes.bool,
    enableTransition: PropTypes.bool,
    currentPage: PropTypes.number,
    totalNumberOfPages: PropTypes.number
  };

  navigateToPage(event: SyntheticEvent, url: ?string) {
    if (this.props.enableTransition) {
      window.history.push(url);
    }
  }

  /**
   * formatUrl - Formats a url for the specified page number
   *
   * @memberOf PainlessPagination class
   * @param {string} pathName
   * @param {?string} pageQueryParam
   * @param {number} pageNumber
   * @param {?string} otherQueryParams
   */
  formatUrl(pathName: string, pageQueryParam: ?string, pageNumber: number, otherQueryParams: ?string) {
    let queryParam = "";
    let forwardSlash = "/";
    let queryParams = "";

    if (pageQueryParam) {
      queryParam = `?${pageQueryParam}=`;
      forwardSlash = "";
    }

    if (pathName === "/") {
      pathName = "";
    }

    if (otherQueryParams) {
      queryParams = `&${otherQueryParams}`;
    }

    return `${pathName}${forwardSlash}${queryParam}${pageNumber}${queryParams}`;
  }

  renderPaginationRow(
    currentPage: number,
    pageCount: number,
    pathName: string,
    pageQueryParam: ?string,
    otherQueryParams: ?string
  ) {
    const paginationVals = [];
    const delta = currentPage < 3 ? 4 : 2;
    const left =
      currentPage > pageCount - 2
        ? pageCount - currentPage === 0 ? currentPage - (delta + 2) : currentPage - (delta + 1)
        : currentPage - delta;
    const right = currentPage === 2 ? currentPage + delta : currentPage + delta + 1;
    let result = [];

    result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(i => i && i >= left && i < right);

    for (let x = 0; x < result.length; x++) {
      if (result[x] === currentPage) {
        paginationVals.push(
          <PainlessPaginationLink
            key={result[x]}
            href={this.formatUrl(pathName, pageQueryParam, result[x], otherQueryParams)}
          >
            <PainlessPaginationNumber border={this.props.border} circle={this.props.circle} active>
              {result[x]}
            </PainlessPaginationNumber>
          </PainlessPaginationLink>
        );
      } else {
        paginationVals.push(
          <PainlessPaginationLink
            key={result[x]}
            href={this.formatUrl(pathName, pageQueryParam, result[x], otherQueryParams)}
          >
            <PainlessPaginationNumber border={this.props.border} circle={this.props.circle}>
              {result[x]}
            </PainlessPaginationNumber>
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
    let otherQueryParams = "";
    const location = window.location;

    // first check and see if the url contains the page number as it's last element
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

    // next, check to see if there is a query param that we recognize
    if (location.hasOwnProperty("search") && location.search) {
      const trimmedSearchString = location.search.substring(1, location.search.length);
      const searchParams = trimmedSearchString.split("&");
      for (let index = 0; index < searchParams.length; index++) {
        const searchElements = searchParams[index].split("=");
        const searchTerm = searchElements[0].toLowerCase();

        if (pageQueryParams.includes(searchTerm)) {
          currentPageNumber = parseInt(searchElements[1]);
          pageNumberQueryParam = searchTerm;
          searchParams.splice(index, 1);
          break;
        }
      }
      otherQueryParams = searchParams.join("&");
    }

    // return what we've found
    return { currentPageNumber, pageNumberQueryParam, pathName, otherQueryParams };
  }

  /**
   * React render method.
   * @memberof PainlessPagination class.
   * @return {string} - HTML markup for the component.
   */
  render() {
    const totalPages = this.props.totalNumberOfPages;
    const { currentPageNumber, pageNumberQueryParam, pathName, otherQueryParams } = this.getPaginationInformation();
    const nextPageNumber = currentPageNumber + 1;
    const previousPageNumber = currentPageNumber > 1 ? currentPageNumber - 1 : currentPageNumber;
    let leftArrowVisibility = "visible",
      rightArrowVisibility = "visible";

    if (currentPageNumber === 1) {
      leftArrowVisibility = "hidden";
    } else if (currentPageNumber === totalPages) {
      rightArrowVisibility = "hidden";
    }

    return (
      <PainlessPaginationWrapper>
        <PainlessPaginationList>
          <PainlessPaginationLink
            style={{ visibility: leftArrowVisibility }}
            href={this.formatUrl(pathName, pageNumberQueryParam, previousPageNumber, otherQueryParams)}
            rel="prev"
          >
            <PainlessPaginationArrow onClick={this.navigateToPage}>
              <LeftArrow />
            </PainlessPaginationArrow>
          </PainlessPaginationLink>
          {this.renderPaginationRow(currentPageNumber, totalPages, pathName, pageNumberQueryParam, otherQueryParams)}
          <PainlessPaginationLink
            style={{ visibility: rightArrowVisibility }}
            href={this.formatUrl(pathName, pageNumberQueryParam, nextPageNumber, otherQueryParams)}
            rel="next"
          >
            <PainlessPaginationArrow
              onClick={e =>
                this.navigateToPage(e, this.formatUrl(pathName, pageNumberQueryParam, nextPageNumber, otherQueryParams))
              }
            >
              <RightArrow />
            </PainlessPaginationArrow>
          </PainlessPaginationLink>
        </PainlessPaginationList>
      </PainlessPaginationWrapper>
    );
  }
}

export default PainlessPagination;
