import React, { useState, useEffect, Fragment } from "react";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import "./Styles.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Input, Row, Col, Mentions } from "antd";
import _ from "lodash";
import "antd/dist/antd.css";
import Token from "./Token";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout = WidthProvider(RGL);
const { Option } = Mentions;
export default function DragFromOutsideLayout(props) {
  const [compactType, setcompactType] = useState("vertical");
  const [mounted, setmounted] = useState(false);
  const [draggedFrom, setDraggedFrom] = useState("");
  const [draggedToken, setDraggedToken] = useState("");
  const [MappingTokens, setMappingTokens] = useState(Token.MappingTokens);
  const [layout, setlayout] = useState([
    { i: "a", x: 0, y: 0, w: 15, h: 1, static: true },
    // { i: "b", x: 1, y: 0, w: 3, h: 2 },
    // { i: "c", x: 4, y: 0, w: 1, h: 2 },
    // { i: "d", x: 0, y: 2, w: 1, h: 2 }
  ]);
  const [currentProccessedIndex, setCurrentProcessedIndex] = useState(-1);
  const [disableDrag, setDisableDrag] = useState(false);
  const removeStyle = {
    position: "absolute",
    right: "2px",
    top: 0,
    cursor: "pointer",
  };

  // const onLayoutChange = (nlayout, alayouts) => {
  //   setlayout(nlayout);
  //   // const loi = _.findIndex(alayouts, { i: layout.i });
  //   // if (loi >= 0) {
  //   //   setlayout([...alayouts, { ...nlayout }]);
  //   // }
  // };

  useEffect(() => {
    setmounted(true);
  }, []);

  const getTypeValue = (key) => {
    let typeValue = {};
    switch (key) {
      case "tokenScreen":
        typeValue.type = "token";
        typeValue.value = draggedToken;
        break;
      case "barcode":
        typeValue.type = "barcode";
        typeValue.value = "";
        break;
      case "labelScreen":
        typeValue.type = "label";
        typeValue.value = "";
        break;
      default:
        break;
    }
    return typeValue;
  };
  // const base64ToPdf = (base64, fileName) => {
  //   var link = document.createElement("a");
  //   link.href = "data:application/pdf;base64," + base64;
  //   link.download = fileName || "label.pdf";
  //   link.click();
  // };

  // printBol = () => {
  //   this.setState({
  //     isGeneratingPdf: true,
  //   });
  //   fetchBolPdf(this.state.currentOrder.id)
  //     .then((result) => {
  //       if (result.success) {
  //         base64ToPdf(
  //           result.bol_file,
  //           `OrderBol${this.state.currentOrder.id}.pdf`
  //         );
  //       } else {
  //         console.log("failed to generate pdf");
  //       }
  //     })
  //     .finally(() => {
  //       this.setState({
  //         isGeneratingPdf: false,
  //       });
  //     });
  // };

  const onDrop = (elemParams) => {
    console.log("param:::", elemParams);
    const ele = {
      i: Math.random().toString(),
      x: elemParams.x,
      y: elemParams.y,
      w: elemParams.w,
      h: elemParams.h,
    };
    // if (draggedFrom === "tokenScreen") {
    //   ele.type = "token";
    //   ele.value = draggedToken;
    // }
    // if (draggedFrom === "barcode") {
    //   ele.type = "barcode";
    //   ele.value = "";
    // }
    if (draggedFrom === "labelScreen") {
      setCurrentProcessedIndex(layout.length);
    }
    const typeValue = getTypeValue(draggedFrom);
    setlayout([...layout, { ...ele, ...typeValue }]);
    setDisableDrag(true);
    setDraggedToken("");
    console.log("currentProccessedIndex,", currentProccessedIndex);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      handleSave(index);
    }
  };

  const handleSave = (index) => {
    const Layout = _.cloneDeep(layout);
    const currentData = Object.assign({}, Layout[index]);
    setCurrentProcessedIndex(-1);
    setDisableDrag(false);
  };
  const handleOnchange = (index, type, element, value) => {
    // console.log(index, element, value);
    // const layout = ...layout;
    // console.log(layout);
    const Layout = _.cloneDeep(layout);
    Layout[index][element] = value;
    Layout[index]["type"] = type;

    setlayout(Layout);
  };

  const handleLayoutChange = (newLayout) => {
    setlayout(newLayout);
  };
  const handleResizeStop = (updatedLayout, oldItem, newItem) => {
    console.log("layot", layout);
    const existingItem = _.find(layout, { i: oldItem.i });
    const newLayout = updatedLayout.map((item, index) => {
      if (item.i === oldItem.i) {
        return {
          ...item,
          w: newItem.w,
          h: newItem.h,
          x: newItem.x,
          y: newItem.y,
          type: existingItem.type,
          value: existingItem.value,
        };
      }
      return layout[index];
    });
    setlayout(newLayout);
  };

  const handleDragStop = (updatedLayout, oldItem, newItem) => {
    const existingItem = _.find(layout, { i: oldItem.i });
    const newLayout = updatedLayout.map((item, index) => {
      if (item.i === oldItem.i) {
        return {
          ...item,
          x: newItem.x,
          y: newItem.y,
          type: existingItem.type,
          value: existingItem.value,
        };
      }
      return layout[index];
    });
    setlayout(newLayout);
  };

  const onRemoveItem = (i) => {
    console.log("removing", i);
    //const Layout = _.cloneDeep(layout);
    const updatedLayout = layout.filter((lo) => lo.i !== i); //_.reject(Layout, { i: i });
    console.log("updatedLayout", updatedLayout);
    setlayout(updatedLayout);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={32}>
            <Col xs={6} sm={6} md={6} lg={4}>
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
                <div
                  className="droppable-element"
                  draggable={true}
                  unselectable="on"
                  // this is a hack for firefox
                  // Firefox requires some kind of initialization
                  // which we can do by adding this attribute
                  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                  onDragStart={(e) => {
                    setDraggedFrom("labelScreen");
                    e.dataTransfer.setData("text/plain", "");
                  }}
                >
                  Label
                </div>
                <div
                  className="droppable-element"
                  draggable={true}
                  unselectable="on"
                  // this is a hack for firefox
                  // Firefox requires some kind of initialization
                  // which we can do by adding this attribute
                  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                  onDragStart={(e) => {
                    setDraggedFrom("barcode");
                    e.dataTransfer.setData("text/plain", "");
                  }}
                >
                  Barcode
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={16}>
              <ResponsiveReactGridLayout
                // {...this.props}
                rowHeight={30}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                layout={layout}
                // onLayoutChange={handleLayoutChange}
                onResizeStop={handleResizeStop}
                onDragStop={handleDragStop}
                onDrop={onDrop}
                // WidthProvider option
                measureBeforeMount={false}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={mounted}
                // compactType={compactType}
                preventCollision={!compactType}
                isDroppable={true}
                verticalCompact={false}
                resizeHandles={["ne", "se", "sw", "nw"]}
                // droppingItem={{ i: "xx", h: 2, w: 2 }}
              >
                {layout.map((itm, i) => {
                  const isEditable = currentProccessedIndex === i;
                  console.log("isEditable:::", i);
                  return (
                    <div key={itm.i} data-grid={itm} className="block">
                      {/* {i} */}
                      {draggedFrom === "labelScreen" ? (
                        isEditable ? (
                          <Input
                            size="small"
                            placeholder="Input Element"
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            value={itm.value}
                            onChange={(e) =>
                              handleOnchange(
                                i,
                                "label",
                                "value",
                                e.target.value
                              )
                            }
                            style={{ margin: 15 }}
                          />
                        ) : (
                          <Fragment>{itm.value}</Fragment>
                        )
                      ) : (
                        <Fragment>{itm.value}</Fragment>
                      )}
                      <span
                        // className="remove"
                        style={removeStyle}
                        onClick={() => onRemoveItem(itm.i)}
                      >
                        x
                      </span>
                    </div>
                  );
                })}
              </ResponsiveReactGridLayout>
            </Col>
            <Col xs={6} sm={6} md={6} lg={4}>
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
                {MappingTokens.map((token, index) => (
                  <div
                    className="droppable-element"
                    draggable={true}
                    unselectable="on"
                    // this is a hack for firefox
                    // Firefox requires some kind of initialization
                    // which we can do by adding this attribute
                    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                    onDragStart={(e) => {
                      setDraggedFrom("tokenScreen");
                      setDraggedToken(token.code);
                      e.dataTransfer.setData("text/plain", "");
                    }}
                    key={`${token.code}${index}`}
                  >
                    {token.code}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}