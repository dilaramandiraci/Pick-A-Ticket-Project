import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import { Card, List, Input, Button, Typography, Row, Col } from 'antd';
import { formToJSON } from 'axios';

const { Text } = Typography;

export function ShoppingCartPage() {
  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchTickets();
    fetchBalance();
  }, []);

  const fetchTickets = async () => {
    const res = await Axios.get('/buy/get_tickets');
    setTickets(res.data);
  };

  const fetchBalance = async () => {
  try {
    localStorage.getItem('user');
    let res = JSON.parse(localStorage.getItem('user'));
    console.log(res);
  } catch (error) {
    console.error('Failed to fetch balance:', error.response ? error.response.data : 'No response');
  }
};

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price, 0);
  };

  const handlePurchase = async () => {
    try {
      const total = calculateTotal(tickets);
      await Axios.post('/buy/transaction', {
        amount: total,
        buyer_id: 1, // Get ticket buyer id from session
        organizer_id: 1, //Get organizer id from event
        transaction_date: new Date(),
        transaction_id: 'unique_transaction_id' // New UUID
      });
      fetchBalance(); // Bakiye güncellemesi
      alert('Purchase successful');
    } catch (error) {
      alert('Purchase failed: ' + error.response.data.detail);
    }
  };

  return (
    <Row style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Col>
        <Card title="Chosen Ticket(s)" style={{ width: 300, margin:'20px', height:302, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <List
            dataSource={tickets}
            renderItem={item => (
              <List.Item key={item.id}>
                {item.name}: {item.price} TL
              </List.Item>
            )}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <Text strong>Total</Text>
            <Text strong>{calculateTotal(tickets)} TL</Text>
          </div>
          <Button type="primary" onClick={handlePurchase} style={{ width: '100%', marginTop: '10px' }}>
            Buy
          </Button>
        </Card>
      </Col>
      <Col>
        <Card title="My Balance" style={{ width: 300, margin:'20px' }}>
          <Text>{balance} TL</Text>
        </Card>
        
        <Card style={{ width: 300, margin:'20px' }}>
          <Text type="secondary">Purchased ticket will be identified to the other party</Text>
          <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px' }} />

          <Button type="primary" style={{ backgroundColor: '#a0d911', borderColor: '#a0d911', color: '#000', marginTop: '10px', width: '100%'}}>
            Buy or Gift
          </Button>
        </Card>
      </Col>
    </Row>
  );
}