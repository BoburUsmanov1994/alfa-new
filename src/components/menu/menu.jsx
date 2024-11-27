import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { filter, get, isEqual } from "lodash";
import { ChevronRight, ChevronDown } from "react-feather";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";
import { menuData } from "../../constants/menu";

const StyledMenu = styled.div``;

const StyledMenuLink = styled(NavLink)`
  margin-left: 40px;
  margin-right: 18px;
  padding: 12px 0;
  display: flex;
  border-bottom: 1px solid #cdcdcd;
  justify-content: space-between;
  align-items: center;

  &:hover {
    .menu-title {
      color: #13d6d1;
    }

    .menu-icon > svg {
      stroke: #13d6d1;
    }
  }

  &.active-link,
  &.active {
    margin-left: 0;
    margin-right: 0;
    padding-left: 24px;
    padding-right: 16px;
    background-color: #13d6d1;

    .menu-title {
      color: #fff;
    }

    .menu-icon > svg {
      stroke: #fff;
    }
  }

  .menu-title {
    font-size: 16px;
    color: #000;
    text-decoration: none;
  }

  .menu-icon {
    svg {
      margin-top: 3px;
    }
  }
`;

const StyledSubMenuLink = styled(NavLink)`
  padding: 12px 30px;
  text-decoration: none;
  font-size: 14px;
  color: #000;
  border-bottom: 1px solid #aaaaaa;
  display: block;
  &:hover {
    background-color: #e9e9e9;
  }
  &.active {
    background-color: #e9e9e9;
  }
`;
const Menu = ({ ...rest }) => {
  const user = useStore((state) => get(state, "user", null));

  const [active, setActive] = useState(null);
  const { t } = useTranslation();
  const showSubMenu = (id) => {
    setActive(id);
  };
  return (
    <StyledMenu {...rest}>
      {menuData(get(user, "role.name")) &&
        menuData(get(user, "role.name"))
          .filter((item) => item)
          .map((menu, i) => (
            <>
              <StyledMenuLink
                key={get(menu, "id", i)}
                onClick={(e) => {
                  if (get(menu, "submenu")) e.preventDefault();
                  showSubMenu(get(menu, "id"));
                }}
                to={get(menu, "path", "#")}
                className={classNames({
                  "active-link": isEqual(active, get(menu, "id")),
                })}>
                <span className={"menu-title"}>
                  {t(get(menu, "title", "-"))}
                </span>
                {get(menu, "submenu") && (
                  <span className={"menu-icon"}>
                    {isEqual(active, get(menu, "id")) ? (
                      <ChevronDown size={20} color={"#000"} />
                    ) : (
                      <ChevronRight size={20} color={"#000"} />
                    )}
                  </span>
                )}
              </StyledMenuLink>
              {isEqual(active, get(menu, "id")) &&
                get(menu, "submenu") &&
                filter(get(menu, "submenu", []), (_item) => _item).map(
                  (submenu, j) => (
                    <StyledSubMenuLink
                      to={get(submenu, "path", "#")}
                      key={get(submenu, "id", j)}>
                      {t(get(submenu, "title"))}
                    </StyledSubMenuLink>
                  )
                )}
            </>
          ))}
    </StyledMenu>
  );
};

export default Menu;
