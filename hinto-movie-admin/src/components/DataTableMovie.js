import React, { useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import Button from 'react-bootstrap/Button';


const Table = props => {
  const [value, setValue] = useState('active');
  const columns = [
    {
      name: "Title",
      selector: "title",
      sortable: true,
      width: '10%',
    },
    {
      name: "Image",
      width: '30%',
      cell: (param) => showImage(param)
    },
    {
      name: "Show Date",
      selector: "show_date",
      sortable: true,
      width: '10%',
    },
    {
      name: "Close Date",
      selector: "close_date",
      sortable: true,
      width: '10%',
    },
    {
      name: "Active",
      sortable: true,
      width: '20%',
      cell: (param) => checkActive(param)
    },
    {
      name: "Actions",
      button: true,
      width: '20%',
      cell: (param) => addUpdateDelete(param)
    }
  ];

  const addUpdateDelete = (param) => {
    return (
      <>
        <Button variant="primary" onClick={() => handleEdit(param)}>
          Edit
        </Button>
        <Button variant="danger">Delete</Button>
      </>
    );
  };

  const checkActive = (param) => {

  }

  const showImage = (param) => {
    return (
      <>
        <img
          src={param.image}
          alt='Player'
          height={60}
        />
      </>
    );
  };

  const handleEdit = (data) => {
    console.log(data);

    // setBtnName("Edit");
    // setOpen(true);
    // setEditData(data);
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );
  // const filteredItems = data.filter(
  //   item => item.name && item.name.includes(filterText)
  // );
  const filteredItems = props.data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      title="List Movies"
      columns={columns}
      data={filteredItems}
      defaultSortField="name"
      striped
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
    />
  );
};

export default Table;