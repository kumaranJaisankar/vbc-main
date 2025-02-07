import React from "react";
const Remaining = (props) => {
  console.log(props.leadUser.id, "prosdata");

  let modified_collection = [];

  if (props.collection?.length > 0) {
    let numberOfColumns = props.collection.length / 10;

    if (props.collection.length % 10 > 0) {
      numberOfColumns++;
    }

    let index = 0;
    for (let i = 0; i < props.collection.length; i++) {
      if (index % numberOfColumns == 10) {
        index = 0;
      }

      if (!modified_collection[index]) {
        modified_collection[index] = [];
      }

      modified_collection[index].push(props.collection[i]);
      index++;
    }
  }
  console.log(modified_collection, "modified_collection");


  return (
    <>
      <div
        style={{
          // width: "100%",
          width: "fit-content",
          display: "flex",
          flexDirection: "column",
          // overflowX: "scroll",
          overflow: "auto",
          maxHeight: "300px",
        }}
      >

        {/* Products.sort((a,b) =>  a.price-b.price ).map(data => {
   return <TableRow name={prod.name} price={prod.price} />;
}); */}
        {/* {modified_collection.map((row, index) => (
          <div
            key={index}
           
          > */}
        <table border="1" style={{ marginLeft: "5px", border: "1px solid #a6a6a6" }}>
          {props.collection.map((col, index) => (
            <tr key={index}>
              <td style={{ padding: "10px" }}>{col.ip}</td>
            </tr>
          ))}
        </table>
        {/* </div>
          ))}  */}
      </div>
    </>
  );
};

export default Remaining;
