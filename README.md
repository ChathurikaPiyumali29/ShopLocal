# ShopLocal – Offline Small Business Inventory & Sales Tracker

## Project Description

**ShopLocal** is an individual React Native application developed with Expo to help small shop owners manage their daily inventory and sales records. It provides a simple way to view products, track stock quantities, record sales, manage suppliers, and handle customer returns.

ShopLocal is designed around **local data storage**. It uses AsyncStorage to save shop information on the device instead of relying on a cloud database or public API. This makes it suitable for small businesses that need a straightforward inventory management tool without an online backend.

This project was developed for **IT3133 – ICA 03 Individual React Native Project**.

## Main Features

### 1. Dashboard
- View the number of products and total stock quantity.
- See the total inventory value and today's sales.
- Identify products with low stock levels.

### 2. Product Inventory Management
- View a list of available products.
- Search products by name.
- Filter products by category.
- Open a product to view its details.
- Add new products and edit existing product information.

### 3. Sales Management
- Record product sales.
- Calculate sale totals and maintain sales records.
- Reduce available stock when a sale is recorded.
- Prevent sales quantities from exceeding available stock.

### 4. Supplier Management
- Add, edit, and delete supplier records.
- View supplier information and related products.
- Manage products associated with suppliers.

### 5. Product Returns
- Record customer returns associated with sales.
- Keep return and refund information for reference.
- Returned items are treated as **not for resale** in the current implementation; returns do not automatically increase available stock.

### 6. Offline Local Storage
- Store products, sales, suppliers, supplier products, and returns locally with AsyncStorage.
- Retrieve saved records when the app starts again.
- Manage shop records without a public API or online database.

## Technologies Used


Technology	                 Purpose

React Native	        Mobile application interface

Expo	                Development and running the React Native application

JavaScript	            Application logic

React	                Components and state management

React Navigation	    Bottom-tab and stack navigation

AsyncStorage	        Persistent local data storage

React Native Web	    Running the application in a web browser during development

## Application Screens

The source code includes these **10 screens**:

1. `DashboardScreen` – Shop overview and low-stock information.
2. `InventoryScreen` – Product list, search, and category filtering.
3. `ProductDetailsScreen` – Detailed information about a selected product.
4. `AddProductScreen` – Add or edit product information.
5. `SalesScreen` – Record and review sales.
6. `ReturnsScreen` – Manage product returns.
7. `SupplierScreen` – List and manage suppliers.
8. `SupplierFormScreen` – Add or edit supplier details.
9. `SupplierDetailsScreen` – View supplier information and associated products.
10. `SupplierProductFormScreen` – Add or edit products associated with suppliers.

The application uses a combination of **bottom-tab navigation** and **native-stack navigation**.

## Getting Started / Setup Instructions

### Prerequisites

Install or prepare the following:

- [Node.js](https://nodejs.org/) and npm
- Git (to clone the repository)
- A code editor such as Visual Studio Code
- **Expo Go** on a compatible mobile device, or an Android/iOS emulator

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/ChathurikaPiyumali29/ShopLocal.git
```

### Step 2: Open the Project Folder

```bash
cd ShopLocal
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Application

```bash
npx expo start
```

Then use a compatible device with Expo Go or a configured emulator to open the project.

### Step 5: Run on the Web (Optional)

```bash
npm run web
```

Expo will display the development server address in the terminal. Open the displayed address in a browser if it does not open automatically.

Other scripts available in `package.json`:

```bash
npm run android
npm run ios
```

**Note:** Installing dependencies and using Expo development tools may require internet access. ShopLocal's shop records use local storage; verify offline operation on the target device after the app is running. Web storage and mobile-device storage are separate.

## How to Use the Application

1. Open **Dashboard** to review stock, inventory value, sales, and low-stock items.
2. Go to **Inventory** to browse, search, filter, and inspect products.
3. Use **Add Product** to create or update product records.
4. Go to **Sales** to record a sale and update the available quantity.
5. Open **Suppliers** to add suppliers and manage their associated products.
6. Open **Returns** to record a customer return.
7. Restart the app to check that saved data loads from local storage.

## Data Management and Offline Functionality

The app uses `@react-native-async-storage/async-storage` to save its data locally. Shared application state and loading/saving logic are implemented in `src/context/ShopContext.js`.

The current local storage collections are:

- `products`
- `sales`
- `suppliers`
- `supplierProducts`
- `returns`

Initial sample products are defined in `src/data/sampleData.js`. Data saved on one device is not automatically synchronized to other devices. Clearing the app's storage or uninstalling the app may remove locally stored data.

## Project Folder Structure

```text
ShopLocal/
├── App.js
├── index.js
├── app.json
├── package.json
├── package-lock.json
├── assets/
└── src/
    ├── components/
    │   └── ProductCard.js
    ├── context/
    │   └── ShopContext.js
    ├── data/
    │   └── sampleData.js
    └── screens/
        ├── DashboardScreen.js
        ├── InventoryScreen.js
        ├── ProductDetailsScreen.js
        ├── AddProductScreen.js
        ├── SalesScreen.js
        ├── ReturnsScreen.js
        ├── SupplierScreen.js
        ├── SupplierFormScreen.js
        ├── SupplierDetailsScreen.js
        └── SupplierProductFormScreen.js
```

## Project Repository

GitHub: https://github.com/ChathurikaPiyumali29/ShopLocal

## Academic Information

- **Module:** IT3133
- **Assessment:** ICA 03 – Individual React Native Project
- **Project Title:** ShopLocal – Offline Small Business Inventory & Sales Tracker
- **Project Type:** Individual academic project

## Notes

- The project is intended for educational use.
- Test each feature on the target device before the project demonstration.
- The app does not require a public API or online database to manage shop records.
