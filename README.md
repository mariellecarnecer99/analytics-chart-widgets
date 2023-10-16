# analytics-chart-widgets

A great plugin which you can fully customize different charts and be able to generate a code which can be embedded to any website

## Demo

[Have fun!](https://analytics-chart-widgets-dashboard.vercel.app)

## Project setup

### Installation

**Using yarn**

yarn add vue-analytics-chart-widgets

**Using npm**

npm i vue-analytics-chart-widgets

### Usage

    import { registerPlugins } from "vue-analytics-chart-widgets"
    import "vue-analytics-chart-widgets/style.css";

    app.use(registerPlugins)

    <script>
        import { VueAnalyticsChartWidgets } from "vue-analytics-chart-widgets";
        export default {
          components: {
            VueAnalyticsChartWidgets
          }
        }
    </script>

    <template>
        <VueAnalyticsChartWidgets />
    </template>

## Features

- Can add more than one chart(with different charting libraries) in your reports
- Can edit your charts simultaneously
- Can add your own data for the charts
  - Upload data source(csv)
  - Input service url
  - Blend data
- Date control filter for each charts
- Date control that filter out all the configured charts
- Can add styles to your charts
- Preview configured report
- Download report as image
- Will have a full control of your chart data and controls
  - Date range control
  - Chart title
  - Chart description
- Can embed your chart/report into your website
- Charts can be draggable and resizable
- Reports Dashboard
  - Can add, edit and delete report
