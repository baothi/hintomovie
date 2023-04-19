import React, { useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import Button from 'react-bootstrap/Button';
import { putMovie } from "../services/UserService";
import { useNavigate } from 'react-router-dom'


const Table = props => {
  const token = localStorage.getItem('mytoken');
  const navigate = useNavigate()
  const [value, setValue] = useState('active')
  const config = {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Token ${token}`
    }
  }
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
      cell: (param) => checkActive(param),
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
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => handleEdit(param)}
        >
          Edit
        </Button>
        <Button onClick={() => deleteMovei(param)} variant="danger">Delete</Button>
      </>
    );
  };

  const deleteMovei = (param) => {
    if (window.confirm(`Delete? ${param.title}`)) {
      console.log("Delete : ", param.id);
      // window.location.href = '/listmovie';
      filteredItems.filter(item => item.id !== param.id)

    }

  };

  const handleChange = async (event) => {
    const select = event.target;
    console.log("handleChange : ", select.value);
    const id = select.children[select.selectedIndex].id;
    const active = select.value;
    const tobody = JSON.stringify({ active });
    console.log("handleChange : ", tobody);
    const res = await putMovie(tobody, config, id);
    console.log("handleChange : ", res);

  };

  const checkActive = (param) => {
    if (param && param.active === true) {
      return (
        <select value={true} onChange={handleChange}>
          <option id={param.id} value={true}>Active</option>
          <option id={param.id} value={false}>UnActive</option>
        </select>
      )
    } else {
      return (
        <select value={false} onChange={handleChange}>
          <option id={param.id} value={false}>UnActive</option>
          <option id={param.id} value={true}>Active</option>
        </select>
      )
    }


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
    console.log('handleEdit: ', data)
    navigate(`/listmovie/${data.id}`)
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
    const handleChangeItem = (event) => {
      console.log("handleChangeItem :", event.target.value);
      console.log("handleChangeItem :", filteredItems);
    };

    return (
      <>
        {/* <select onChange={handleChangeItem}>
          <option value={true}>Active</option>
          <option value={false}>UnActive</option>
        </select> */}
        <FilterComponent
          onFilter={e => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />
      </>
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