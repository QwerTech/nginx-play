#!/bin/bash

oc process -f ./nginx-blue-deployment.yaml | oc apply -f -
oc process -f ./nginx-green-deployment.yaml | oc apply -f -