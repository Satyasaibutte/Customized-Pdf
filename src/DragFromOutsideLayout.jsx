import React, { useState, useEffect, Fragment } from "react";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import "./Styles.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Input, Row, Col } from "antd";
import _ from "lodash";
import "antd/dist/antd.css";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout = WidthProvider(RGL);

export default function DragFromOutsideLayout(props) {
  const [compactType, setcompactType] = useState("vertical");
  const [mounted, setmounted] = useState(false);
//   const [MappingTokens, setMappingTokens] = useState(Token.MappingTokens);
  const [layout, setlayout] = useState([
    { i: "a", x: 0, y: 0, w: 5, h: 5 },
  ]);
  const [data, setData] = useState([]);
  const [currentProccessedIndex, setCurrentProcessedIndex] = useState(-1);
  const [disableDrag, setDisableDrag] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  const onDrop = (elemParams) => {
    setlayout([
      ...layout,
      {
        i: Math.random().toString(),
        x: elemParams.x,
        y: elemParams.y,
        w: elemParams.w,
        h: elemParams.h,
      },
    ]);
    // setIsEditable(true);
    setCurrentProcessedIndex(layout.length);
    setDisableDrag(true);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      handleSave(index);
    }
  };

  const handleSave = (index) => {
    console.log("index", index);
    const Layout = _.cloneDeep(layout);
    const currentData = Object.assign({}, Layout[index]);
    console.log("index", currentData);
    // setIsEditable(false);
    setCurrentProcessedIndex(-1);
    setDisableDrag(false);
  };
  const handleOnchange = (index, element, value) => {
    // console.log(index, element, value);
    // const layout = ...layout;
    // console.log(layout);
    const Layout = _.cloneDeep(layout);
    Layout[index][element] = value;
    setlayout(Layout);
  };
  return (
    <div>
      <Row gutter={4}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={32}>
            <Col xs={6} sm={6} md={6} lg={6}>
              <div
                style={{
                  height: 821,
                  overflowY: "auto",
                  padding: 5,
                  border: "1px solid #CCC",
                  fontSize: 12,
                  paddingBottom: 15,
                }}
              >
                {!disableDrag && (
                  <div
                    className="droppable-element"
                    draggable={true}
                    unselectable="on"
                    // this is a hack for firefox
                    // Firefox requires some kind of initialization
                    // which we can do by adding this attribute
                    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", "")
                    }
                  >
                    Droppable Element (Drag me!)
                  </div>
                )}
              </div>
              <div
                style={{
                  height: 821,
                  overflowY: "auto",
                  padding: 5,
                  border: "1px solid #CCC",
                  fontSize: 12,
                  paddingBottom: 15,
                }}
              >
                {!disableDrag && (
                  <div
                    className="droppable-element"
                    draggable={true}
                    unselectable="on"
                    // this is a hack for firefox
                    // Firefox requires some kind of initialization
                    // which we can do by adding this attribute
                    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", "")
                    }
                  >
                    Droppable Element (Drag me!)
                  </div>
                )}
              </div>
            </Col>
            
            <Col xs={12} sm={12} md={12} lg={12}>
              <ResponsiveReactGridLayout
                // {...this.props}
                rowHeight={30}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                layout={layout}
                // onLayoutChange={this.onLayoutChange}
                onDrop={onDrop}
                // WidthProvider option
                measureBeforeMount={false}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={mounted}
                compactType={compactType}
                preventCollision={!compactType}
                isDroppable={true}
                droppingItem={{ i: "xx", h: 2, w: 2 }}
              >
                {layout.map((itm, i) => {
                  const isEditable = currentProccessedIndex === i;
                  return (
                    <div key={itm.i} data-grid={itm} className="block">
                      {/* {i} */}
                      {isEditable ? (
                        <Input
                          placeholder="Input Element"
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          value={itm.label}
                          onChange={(e) =>
                            handleOnchange(i, "label", e.target.value)
                          }
                          style={{ margin: 30 }}
                        />
                      ) : (
                        <Fragment>{itm.label}</Fragment>
                      )}
                    </div>
                  );
                })}
              </ResponsiveReactGridLayout>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <div
                style={{
                  height: 821,
                  overflowY: "auto",
                  padding: 5,
                  border: "1px solid #CCC",
                  fontSize: 12,
                  paddingBottom: 15,
                }}
              >
                <h1 >Tokens</h1>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}