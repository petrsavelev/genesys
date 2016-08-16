"use strict";

(function() {
    const CATEGORY_ITEMS = "ccDIMENSION";

    angular.module('app', ["chart.js"]).
        controller("barCtrl", function ($scope, $http) {
            var $ctrl = this;

            $scope.updatePlanetSelection = updatePlanetSelection;
            $scope.updatePlanetsOnData = updatePlanetsOnData;
            $scope.measureType = "";
            $scope.measurementTypes = [];
            $scope.measurementData = {};

            $http.get("data.json").then(function(response) {
                handleData(response.data);
            });

            function handleData(data) {
                if(data.col && data.col.length) {
                    // Planets
                    data.col.find(function(row, index, arr) {
                        if(row.col && row.col.category && row.col.category === CATEGORY_ITEMS) {
                            $ctrl.labelsAll = row.v.map(function(item, index) {
                                return {
                                    label: item,
                                    on: true,
                                    index: index
                                };
                            });
                            arr.splice(index, 1);

                            return true;
                        }
                    });

                    // Measurements
                    data.col.forEach(function(row, index, arr) {
                        $scope.measurementTypes.push(
                            {
                                label: row.col.label,
                                value: row.col.id
                            });
                        $scope.measurementData[row.col.id] = {
                            "label": row.col.label,
                            "values": row.v
                        };
                    });

                    $scope.measureType = $scope.measurementTypes[0].value;

                    updatePlanetSelection();
                }
            }

            function updatePlanetSelection() {
                $scope.labels = $ctrl.labelsAll.reduce(function(all, item) {
                    if(item.on === true) {
                        all.push(item.label);
                    }

                    return all;
                }, []);

                updatePlanetsOnData();
            }

            function updatePlanetsOnData() {
                $scope.data = $scope.measurementData[$scope.measureType].
                    values.filter(function(value, index) {
                        return $ctrl.labelsAll[index].on;
                    });
            }
        });
})();
