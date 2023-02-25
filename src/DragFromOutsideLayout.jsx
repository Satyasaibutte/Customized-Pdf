import React, { useState, useEffect, Fragment } from "react";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import "./Styles.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { dragApi } from "./drag";
import {
  Input,
  Row,
  Col,
  Mentions,
  Alert,
  Button,
  Icon,
  Select,
  Divider,
} from "antd";
import _ from "lodash";
import FormItem from "antd/lib/form/FormItem";
import "antd/dist/antd.css";
import Token from "./Token";
// import alertMessage from "./common";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout = WidthProvider(RGL);
const { Option } = Mentions;
export default function DragFromOutsideLayout(props) {
  const [compactType, setcompactType] = useState("vertical");
  const [mounted, setmounted] = useState(false);
  const [draggedFrom, setDraggedFrom] = useState("");
  const [draggedToken, setDraggedToken] = useState("");
  const [MappingTokens, setMappingTokens] = useState(Token.MappingTokens);
  const [isNewLabel, setIsNewLabel] = useState(false);
  const [font_name, setFontName] = useState("Courier");
  const [font_size, setFontSize] = useState(10);
  const [font_weight, setFontWeight] = useState("normal");
  const [dataSource,setDataSource] = useState("");
  const [layout, setlayout] = useState([
    { i: "a", x: 0, y: 0, w: 15, h: 1, static: true },
  ]);
  const [currentProccessedIndex, setCurrentProcessedIndex] = useState(-1);
  const [disableDrag, setDisableDrag] = useState(false);
  const removeStyle = {
    position: "absolute",
    right: "2px",
    top: 0,
    cursor: "pointer",
  };

  useEffect(() => {
    setmounted(true);
  }, []);

  const getTypeValue = (key) => {
    const style = {
      // font_name: font_name,
      font_size: font_size,
      font_weight: font_weight,
    };
    let typeValue = { style };
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

  const onDrop = (elemParams) => {
    console.log("param:::", elemParams);
    const ele = {
      i: Math.random().toString(),
      x: elemParams.x,
      y: elemParams.y,
      w: elemParams.w,
      h: elemParams.h,
      style: {},
    };
    // if (draggedFrom === "tokenScreen") {
    //   ele.type = "token";
    //   ele.value = draggedToken;
    // }
    // if (draggedFrom === "barcode") {
    //   ele.type = "barcode";
    //   ele.value = "";
    // }
    if (draggedFrom === "labelScreen" || draggedFrom === "barcode") {
      setCurrentProcessedIndex(layout.length);
    }
    const typeValue = getTypeValue(draggedFrom);
    setIsNewLabel(true);
    setlayout([...layout, { ...ele, ...typeValue }]);
    setDisableDrag(true);
    setDraggedToken("");
    console.log("currentProccessedIndex,", currentProccessedIndex);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      if (layout[index].value) {
        handleSave(index);
      } else {
        // alertMessage("Please Add Label!!!", "error");
      }
    }
  };

  const handleSave = (index) => {
    const Layout = _.cloneDeep(layout);
    const currentData = Object.assign({}, Layout[index]);
    setCurrentProcessedIndex(-1);
    setDisableDrag(false);
    setIsNewLabel(false);
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
          style: { ...existingItem.style },
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
          style: { ...existingItem.style },
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
  
  const handleDownloadPdf= async()=> {
    const filteredLayout = layout.filter((record, index) => index !== 0);
    const payload = {
      font_name: font_name,
      grids: filteredLayout,
    };
    const response = await dragApi.create(payload)
    setDataSource(response)
  }

  // useEffect(()=> {
  //   handleDownloadPdf()
  // })

  return (
    <div>
      <Row className="page-header">
        <Col style={{ textAlign: "left" }}>PDF Generate</Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={32}>
            <Col xs={6} sm={6} md={6} lg={4}>
              <div
                style={{
                  height: "94vh",
                  overflowY: "auto",
                  padding: 5,
                  border: "1px solid #CCC",
                  fontSize: 12,
                  paddingBottom: 15,
                }}
              >
                <div>
                  <h1 className="labelHeading">Labels</h1>
                </div>
                {!isNewLabel && (
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
                      // setIsNewLabel(false);
                      e.dataTransfer.setData("text/plain", "");
                    }}
                  >
                    Label
                  </div>
                )}
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
                  disableDrag={isNewLabel}
                >
                  Barcode
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={16}>
              <Row>
                <Col sm={8} xs={8} md={8} lg={8}>
                  <div
                    style={{
                      borderRight: "solid",
                      borderRightColor: "#e8e8e8",
                      // width: 200,
                      height: 105,
                    }}
                  >
                    <Col sm={22} xs={22} md={22} lg={22}>
                      <FormItem label="Font Name">
                        <Select
                          value={font_name}
                          showSearch
                          style={{ width: "70%" }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(e) => setFontName(e)}
                        >
                          <Option value="Times-Roman">Times Roman</Option>
                          <Option value="Helvetica">Helvetica</Option>
                          <Option value="Courier">Courier</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </div>
                </Col>
                <Col sm={16} xs={16} md={16} lg={16}>
                  <Row gutter={12}>
                    <Col
                      sm={24}
                      xs={24}
                      md={12}
                      lg={7}
                      span={8}
                      style={{ marginLeft: 60 }}
                    >
                      <FormItem label="Font Size">
                        <Select
                          value={font_size}
                          showSearch
                          style={{ width: "100%" }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(e) => setFontSize(e)}
                        >
                          <Option value={8}>8</Option>
                          <Option value={10}>10</Option>
                          <Option value={12}>12</Option>
                          <Option value={14}>14</Option>
                          <Option value={16}>16</Option>
                          <Option value={18}>18</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col
                      sm={24}
                      xs={24}
                      md={12}
                      lg={7}
                      span={8}
                      style={{ marginLeft: 25 }}
                    >
                      <FormItem label="Font Weight">
                        <Select
                          value={font_weight}
                          showSearch
                          style={{ width: "100%" }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(e) => setFontWeight(e)}
                        >
                          <Option value="normal">Normal</Option>
                          <Option value="bold">Bold</Option>
                          <Option value="italic">Italic</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col
                      sm={24}
                      xs={24}
                      md={12}
                      lg={3}
                      style={{ marginTop: 20, marginLeft: 50 }}
                    >
                      <Icon />
                      {/* <Icon type="cloud-download" /> */}
                      <Button
                        icon="download"
                        type="primary"
                        onClick={() => handleDownloadPdf("pdf")}
                      >
                        PDF
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

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
                // height={600}
                droppingItem={{ i: "xx", h: 2, w: 2 }}
              >
                {layout.map((itm, i) => {
                  const isEditable = currentProccessedIndex === i;
                  console.log("isEditable:::", isEditable);
                  return (
                    <div key={itm.i} data-grid={itm} className="block">
                      {/* {i} */}
                      {draggedFrom === "labelScreen" ? (
                        isEditable ? (
                          <Input
                            autoFocus
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
                      ) : draggedFrom === "barcode" ? (
                        isEditable ? (
                          <Mentions
                            style={{ width: "100%", margin: 15 }}
                            placeholder="Select Mention"
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            value={itm.value}
                            onChange={(e) =>
                              handleOnchange(
                                i,
                                "barcode",
                                "value",
                                e.target.value
                              )
                            }
                           
                          >
                            {MappingTokens.map((token, index) => (
                              <Option
                                key={`option${token.code}${index}`}
                                value={token.code}
                              >
                                {token.code}
                              </Option>
                            ))}
                          </Mentions>
                        ) : (
                          <Fragment>{itm.value}</Fragment>
                        )
                      ) : (
                        <Fragment>{itm.value}</Fragment>
                      )}
                      {i != 0 && (
                        <span
                          // className="remove"
                          style={removeStyle}
                          onClick={() => onRemoveItem(itm.i)}
                        >
                          x
                        </span>
                      )}
                    </div>
                  );
                })}
              </ResponsiveReactGridLayout>
            </Col>

            <Col xs={6} sm={6} md={6} lg={4}>
              <div
                style={{
                  height: "94vh",
                  overflowY: "auto",
                  padding: 5,
                  border: "1px solid #CCC",
                  fontSize: 12,
                  paddingBottom: 15,
                }}
              >
                <div className="tokenHeading">
                  <h1>Tokens</h1>
                </div>
                {MappingTokens.map((token, index) => (
                  <div
                    className="token-elements "
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
