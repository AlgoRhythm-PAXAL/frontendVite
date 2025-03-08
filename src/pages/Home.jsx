// src/pages/Home.jsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




const Home = () => {

  const invoices = [
    {
      invoice: "INV001",
      customerName: "John Doe",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
      issuedDate: "2024-02-01",
      dueDate: "2024-02-10",
      items: [
        { name: "Laptop", quantity: 1, price: "$250.00" }
      ]
    },
    {
      invoice: "INV002",
      customerName: "Jane Smith",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
      issuedDate: "2024-02-05",
      dueDate: "2024-02-15",
      items: [
        { name: "Headphones", quantity: 1, price: "$100.00" },
        { name: "USB Cable", quantity: 2, price: "$25.00" }
      ]
    },
    {
      invoice: "INV003",
      customerName: "Alice Johnson",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
      issuedDate: "2024-02-07",
      dueDate: "2024-02-20",
      items: [
        { name: "Monitor", quantity: 1, price: "$350.00" }
      ]
    },
    {
      invoice: "INV004",
      customerName: "Bob Brown",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
      issuedDate: "2024-02-08",
      dueDate: "2024-02-18",
      items: [
        { name: "Gaming Mouse", quantity: 2, price: "$90.00" },
        { name: "Mechanical Keyboard", quantity: 1, price: "$270.00" },
        { name: "Mouse Pad", quantity: 1, price: "$90.00" }
      ]
    },
    {
      invoice: "INV005",
      customerName: "Emily White",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
      issuedDate: "2024-02-10",
      dueDate: "2024-02-25",
      items: [
        { name: "Smartphone", quantity: 1, price: "$550.00" }
      ]
    },
    {
      invoice: "INV006",
      customerName: "David Green",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
      issuedDate: "2024-02-12",
      dueDate: "2024-02-28",
      items: [
        { name: "Smartwatch", quantity: 1, price: "$200.00" }
      ]
    },
    {
      invoice: "INV007",
      customerName: "Sophia Lee",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
      issuedDate: "2024-02-15",
      dueDate: "2024-03-01",
      items: [
        { name: "Tablet", quantity: 1, price: "$300.00" }
      ]
    }
  ];
  
  return (
    <div>
      
      <div className="w-6/12">
      <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Issued Date</TableHead>
          <TableHead className="text-right">Due Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.issuedDate}</TableCell>
            <TableCell className="text-right">{invoice.dueDate}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
      </div>
      
    </div>
  )
}

export default Home









