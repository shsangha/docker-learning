import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const login = gql`
  mutation signup($input: AuthInput!) {
    signUp(input: $input) {
      ... on success {
        token
        refreshToken
      }
      ... on error {
        emailErrors
        passwordErrors
      }
    }
  }
`;

export default class Mut extends Component {
  state = {
    email: '',
    password: ''
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Mutation mutation={login}>
        {(login, { data }) => (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                login({
                  variables: {
                    input: {
                      email: this.state.email,
                      password: this.state.password
                    }
                  }
                });
              }}
            >
              <input type="text" name="email" onChange={this.hanleChange} />
              <input type="text" name="password" onChange={this.hanleChange} />
              <button type="submit">send</button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}
