import { Component } from 'preact';
import { route } from 'preact-router';
import {useEffect} from "preact/hooks";

const Redirect = (props) => {
  useEffect(() => {
    route(props.to, true);
  },[])
  return null
}

export default Redirect
