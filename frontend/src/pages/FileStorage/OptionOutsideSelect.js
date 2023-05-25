import { Box, Form, Button, FormField, Text, TextInput, DateInput } from "grommet";
import Select, { components as Components } from "react-select";
import styled from "styled-components";
import { useEffect, useState } from "react";
import React from "react";

import { useNavigate } from "react-router-dom";
import Axios from "axios";
import axios from "axios";


const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

`;

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  font-size: 0.75rem;
  color: black;
  background-color: rgba(0, 232, 207, 0.6);
  border-radius:18px;
  user-select: none;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: black;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #bb392d;
  }
  &:focus {
    color: #c82f21;
  }
`;


const OptionComponent = (props) => {

  return (
    <Components.Option {...props}>
      {props.children}
    </Components.Option>
  );
};



const SelectUsers = (props) => {
  const [selected, setSelected] = useState([]);
  const [users_data, setusers_data] = useState();

  useEffect(() => {
    axios.get("http://localhost:8001/api/v1/users").then((res) => {
      setusers_data(res.data);
      console.log(users_data)
    })
  }, [])


  const handleSelectChange = (values) => {
    setSelected(values);

    console.log(selected)

  };

  return (
    <>

      {users_data && (
        <OptionsOutsideSelect
          options={users_data}
          isMulti
          value={selected}
          onChange={handleSelectChange}
          setSelectedUsers={props.setSelectedUsers}
        />
      )}
    </>
  );

};

const OptionsOutsideSelect = (props) => {
  const { isMulti, value, onChange, options, setSelectedUsers } = props;
  const [formValues, setFormvalues] = useState({});

  let navigate = useNavigate();

  console.log(options)
  setSelectedUsers(value)



  const handleRemoveValue = (removedValue) => {
    if (!onChange) return;
    onChange(value.filter((val) => val.value !== removedValue.value));
  };
  const selectOptions = options.map((user) => ({
    value: user._id,
    label: user.name,
  }));


  return (
    <Box>
      <ValuesContainer>
        {isMulti
          ? value.map((val) => (
            <Value key={val.value}>
              {val.label}
              <XButton

                name={val.value}
                onClick={() => handleRemoveValue(val)}
              >X</XButton>
            </Value>
          ))
          : null}
      </ValuesContainer>
      <Select
        {...props}
        controlShouldRenderValue={!isMulti}
        options={selectOptions}
        components={{ Option: OptionComponent }}

      />
    </Box>
  );
};

export default SelectUsers;
