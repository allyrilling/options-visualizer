import React, { useState } from 'react';
import { Col, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function OutputTextbox({ title, description, value }) {
	// const [title, setTitle] = useState('');
	// const [description, setDescription] = useState('');
	// const [value, setValue] = useState('');

	return (
		<Col>
			<OverlayTrigger placement='right' overlay={<Tooltip>{description}</Tooltip>}>
				<Form.Label>{title}</Form.Label>
			</OverlayTrigger>
			<InputGroup>
				<InputGroup.Text>$</InputGroup.Text>
				<Form.Control disabled value={value} />
			</InputGroup>
		</Col>
	);
}
