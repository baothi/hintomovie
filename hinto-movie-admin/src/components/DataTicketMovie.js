import DataTable from 'react-data-table-component'
import Button from 'react-bootstrap/Button'

const TableTicket = ({
  ticketInfoList,
  onEditTicketInfo,
  onDeleteTicketInfo
}) => {
  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date_picker,
      sortable: true,
      width: '15%'
    },
    {
      name: 'Time',
      selector: (row) => row.time_show_date,
      sortable: true,
      width: '15%'
    },
    {
      name: 'Price',
      selector: 'price',
      sortable: true,
      width: '15%'
    },
    {
      name: 'Website',
      selector: 'website',
      sortable: true,
      width: '40%'
    },
    {
      name: 'Actions',
      button: true,
      width: '15%',
      cell: (row) => addUpdateDelete(row)
    }
  ]

  const addUpdateDelete = (data) => {
    return (
      <>
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => onEditTicketInfo(data)}
        >
          Edit
        </Button>
        <Button onClick={() => onDeleteTicketInfo(data)} variant="danger">
          Delete
        </Button>
      </>
    )
  }

  return (
    <DataTable
      title=""
      columns={columns}
      data={ticketInfoList}
      defaultSortField="name"
      striped
    />
  )
}

export default TableTicket
