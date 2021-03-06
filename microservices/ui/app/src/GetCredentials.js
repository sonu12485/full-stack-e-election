import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';

import { getSavedToken } from './config';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { MonthPicker, RangePicker } = DatePicker;

const states = [{
    value: 'Andaman and Nicobar Islands',
    label: 'Andaman and Nicobar Islands',

},
{
    value: 'Andhra Pradesh',
    label: 'Andhra Pradesh',

}, {
    value: 'Arunachal Pradesh',
    label: 'Arunachal Pradesh',

}, {
    value: 'Assam',
    label: 'Assam',

}, {
    value: 'Bihar',
    label: 'Bihar',

}, {
    value: 'Chandigarh',
    label: 'Chandigarh',

}, {
    value: 'Chhattisgarh',
    label: 'Chhattisgarh',

}, {
    value: 'Dadra and Nagar Haveli',
    label: 'Dadra and Nagar Haveli',

},
{
    value: 'Daman and Diu',
    label: 'Daman and Diu',

},
{
    value: 'National Capital Territory of Delhi',
    label: 'National Capital Territory of Delhi',

}, {
    value: 'Goa',
    label: 'Goa',

}, {
    value: 'Gujarat',
    label: 'Gujarat',

}, {
    value: 'Haryana',
    label: 'Haryana',

}, {
    value: 'Himachal Pradesh',
    label: 'Himachal Pradesh',

}, {
    value: 'Jammu and Kashmir',
    label: 'Jammu and Kashmir',

}, {
    value: 'Jharkhand',
    label: 'Jharkhand',

}, {
    value: 'Karnataka',
    label: 'Karnataka',

}, {
    value: 'Kerala',
    label: 'Kerala',

}, {
    value: 'Lakshadweep',
    label: 'Lakshadweep',

}, {
    value: 'Madhya Pradesh',
    label: 'Madhya Pradesh',

}, {
    value: 'Maharashtra',
    label: 'Maharashtra',

}, {
    value: 'Manipur',
    label: 'Manipur',

}, {
    value: 'Meghalaya',
    label: 'Meghalaya',

}, {
    value: 'Mizoram',
    label: 'Mizoram',

}, {
    value: 'Nagaland',
    label: 'Nagaland',

}, {
    value: 'Odisha',
    label: 'Odisha',

}, {
    value: 'Puducherry',
    label: 'Puducherry',

}, {
    value: 'Punjab',
    label: 'Punjab',

}, {
    value: 'Rajasthan',
    label: 'Rajasthan',

}, {
    value: 'Sikkim',
    label: 'Sikkim',

}, {
    value: 'Tamil Nadu',
    label: 'Tamil Nadu',

}, {
    value: 'Telangana',
    label: 'Telangana',

}, {
    value: 'Tripura',
    label: 'Tripura',

}, {
    value: 'Uttar Pradesh',
    label: 'Uttar Pradesh',

}, {
    value: 'Uttarakhand',
    label: 'Uttarakhand',

}, {
    value: 'West Bengal',
    label: 'West Bengal',

}];

const gender = [{
    value: 'Male',
    label: 'Male',

}, {
    value: 'Female',
    label: 'Female',

},
{
    value: 'Others',
    label: 'Others',

}];


const authToken = getSavedToken();
class CredentialsForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const nowDate = moment();
                var dateMoment = moment(values.date);
                var dateGot = dateMoment.format("YYYY-MM-DD");
                var age = nowDate.diff(dateGot, 'years');
                console.log(age);

                axios({
                    method: 'post',
                    url: 'https://api.artfully11.hasura-app.io/data',                                           //URL to be modified here
                    data: { auth: authToken },
                    config: { headers: { 'Content-Type': 'application/json' } }
                })
                    .then(function (response) {
                      console.log(response.data.hasura_id);
                      const id = response.data.hasura_id;

                      axios({
                          method: 'post',
                          url: 'https://api.artfully11.hasura-app.io/getcredentials',                                          
                          data: {serial:id,
                            name: values.name,
                            gender: values.gender[0],
                            date: dateGot, state: values.states[0],
                            voterId: values.voterId,
                            email:values.email,
                            phone:Number(values.phone)
                          },
                          config: { headers: { 'Content-Type': 'application/json' } }
                      })
                          .then(function (response) {
                              console.log('Successful post request');
                              console.log(response);
                              //TODO: Display credentials got from response in a copiable span
                              alert(response);
                          })
                          .catch(function (response) {
                              console.log('Unsuccessful post request');
                              console.log(response);
                              alert('Sorry, Server Error!');

                          });
                    })
                    .catch(function (response) {
                      console.log("post req failed");
                    });


            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }


    render() {

        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select date!' }],
        };
        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
               <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            Full Name&nbsp;
              <Tooltip title="Please enter the same name as in your Voter ID Card.">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input your Full Name!', whitespace: true }],
                    })(
                        <Input />
                        )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Gender"
                >
                    {getFieldDecorator('gender', {
                        initialValue: ['Male'],
                        rules: [{ type: 'array', required: true, message: 'Please select your gender!' }]
                    })(
                        <Cascader options={gender} key={gender} />
                        )}
                </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                                Date of Birth&nbsp;
              <Tooltip title="Please enter your DOB as in your Voter ID Card.">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        )}
                    >
                        {getFieldDecorator('date', config)(
                            <DatePicker />
                        )}
                    </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="State"
                >
                    {getFieldDecorator('states', {
                        initialValue: ['Andaman and Nicobar Islands'],
                        rules: [{ type: 'array', required: true, message: 'Please select your state!' }],
                    })(
                        <Cascader options={states} key={states} style={{ width: '100%' }} />
                        )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label = {(
                        <span>
                            Voter ID Number&nbsp;
              <Tooltip title="Please enter the Voter ID Number as in your Voter ID Card.">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('voterId', {
                        rules: [{ required: true, message: 'Please input your voter ID Number!' }, { pattern: '^[A-Z]{3}[0-9]{7}$', message: 'Please input valid voter ID Number!' }],
                    })(
                        <Input style={{ width: '100%' }} />
                        )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E-mail"
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'The e-mail entered is not valid!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input />
                        )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Phone Number"
                >
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }, { pattern: '^((\\+91-?)|0)?[0-9]{10}$', message: 'Please input a valid phone number!' }],
                    })(
                        <Input addonBefore="+91" style={{ width: '100%' }} />
                        )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Get Credentials</Button>
                </FormItem>

                {/*
                    TO DO: Add agree to agreement


                <FormItem {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                        )}
                </FormItem>

                    */}

                {
                    /*
                    TO DO: Add photo upload
                        &
                    Check for >=18 years
                        &
                    Display get credentials
                    */
                }
            </Form>

            </div>
        );
    }
}

const GetCredentials = Form.create()(CredentialsForm);

export default GetCredentials;
