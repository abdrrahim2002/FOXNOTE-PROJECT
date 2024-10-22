# FOXNOTE

## Purpose
**FOXNOTE** is a web application designed for efficient note-taking and organization you can see it live by clicking this [link](https://abd200203.pythonanywhere.com/).

## Quick Look
### User-Friendly Interface
![overview of the project](https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/foxnote%20overview.png)

The application provides an intuitive design that enhances user experience.

### Features Include:
  - **Search Functionality**
<div align="center">
  <img src="https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/search%20title.png" alt="search by Title" width='49%'>
  <img src="https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/search%20tag.png" alt="search by Tag" width='49%'>
  <img src="https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/search%20advance.png" alt="search advance" width='49%'>
</div>

<br>

Quickly find notes with our efficient search feature.

<br>
<br>

 - **Text Customization**
  
  <div align="center">
    <img src="https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/mynote%20ribbon.png" alt="customizable">
  </div>

<br>

  Personalize your notes with various formatting options, thanks to **[Quilljs](https://quilljs.com/)**

<br>
<br>

  - **Organize your note**
  
  <div align="center">
    <img src="https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/foxnote%20overview%20customizable.png" alt="organize">
  </div>

  Easily organize your notes.
  
  No matter how many notes you create, you'll always have a clear overview of your data, helping you stay productive and efficient.

  <br>
  
- **Profile Management**

![Profile Management](https://raw.githubusercontent.com/abdrrahim2002/FOXNOTE-PROJECT/refs/heads/main/project-photo/profile%20management.png)

  Users can manage their profiles effectively. In the Profile Management section, users can:
  - View their personal information.
  - See the number of notes and tags they have created.
  - Change their passwords for enhanced security.
  - Link their profiles with Google for third-party authentication.
  - Delete their profiles if they choose to do so.

  This feature ensures users have control over their data and security within the application.


<br>
<br>

## Installation and Configuration
To run FOXNOTE locally, follow these steps:

First, you need to have **Python 3.8 or above** and also have **pip** and have the **MySQL server** installed on your machine.

<br>

1. Clone the repository:
In terminal:
```
git clone  https://github.com/abdrrahim2002/FOXNOTE-PROJECT.git
cd FOXNOTE-PROJECT
```

<br>

2.Create and activate a virtual environment:
First install the **virtualenv** if you havent yet using:

```
pip install virtualenv
```

<br>

Then create you virtual envirment.

```
virtualenv venv
```

<br>

Then start your virtual envirement:

```
source venv/bin/activate
```

<br>

Then navigatr to the project root file:

```
cd fox_note
```

<br>

Install the required dependencies:

```
pip install -r requirements.txt
```


<br>

Create a MySQL database, in other terminal Log in to MySQL and run the following command to create a database:

```
CREATE DATABASE foxnote_db;
```

<br>

Configure the environment variables in the **.env** file in the project root and fill it with the necessary variables.

<br>

**Secret Key Configuration Instructions**

Django secret key is essential for your application's security, used for cryptographic signing and various security-related functions. By default, a random secret key is automatically generated for your application. However, you also have the option to define your own secret key in the `.env` file.


- **Default Behavior**

  - When you run your application, if the `DJANGO_SECRET_KEY` environment variable is not set in your `.env` file, Django will generate a new random secret key automatically.
  - This behavior is convenient during development, but it is not recommended for production, as the secret key should remain constant.

- **Custom Secret Key Setup**

1. **Generate Your Own Secret Key**:
   - If you prefer to use your own secret key, you can generate a secure key using the following Python commands in a Python shell:
     ```python
     from django.core.management.utils import get_random_secret_key
     print(get_random_secret_key())
     ```
   - This will output a secure random secret key. Copy this key for the next step.

2. **Update the `.env` File**:
   - Open your `.env` file and set the `DJANGO_SECRET_KEY` variable with your generated key:
     ```plaintext
     # Secret key
     DJANGO_SECRET_KEY=your-generated-secret-key
     ```
   - Replace `your-generated-secret-key` with the actual key you copied.

- **Important Notes**

  - **Keep It Secret**: Ensure that your secret key is kept confidential. Do not share it publicly or commit it to version control.
  - **Production Environment**: Always set the `DJANGO_SECRET_KEY` in your production environment to maintain consistent application behavior and security.
  - **Regenerate When Necessary**: If your secret key is exposed, regenerate it and update your `.env` file immediately to ensure the security of your application.


<br>

**Database Configuration Instructions**

To set up your database for the Django project, you'll need to fill in the database configuration fields in your `.env` file. Follow these steps:

1. **DB_NAME**: 
   - This is the name of your database. Choose a meaningful name for your project.

2. **DB_USER**:
   - This is the username used to access the database. This user should have the necessary permissions to create and modify the database.

3. **DB_PASSWORD**:
  - This is the password for the database user specified in `DB_USER`.

4. **DB_HOST**:
   - This is the host where your database is located. If you are using a local MySQL server, you can use `localhost`. If your database is hosted on a different server, enter the appropriate hostname or IP address.
  
  
<br>

**Email Configuration Instructions:**

To enable email verification for user accounts, you'll need to configure the email settings in your `.env` file. Follow these steps to fill in the necessary fields:

1. **EMAIL_HOST_USER**: 
   - This is the email address you want to use to send verification messages. It should be the same email account that you will configure for SMTP access. 
   - Example: 
     ```
     EMAIL_HOST_USER=your-email@gmail.com
     ```

2. **EMAIL_HOST_PASSWORD**:
   - This is the password for the email account you specified in `EMAIL_HOST_USER`. 
   - **Important**: In this project I am using the Gmail, so you need to create an **app-specific password** instead of using your regular email password. To do this:
     - Go to your Google Account settings.
     - Navigate to **Security**.
     - Under **Signing in to Google**, find **App passwords** and follow the prompts to generate a password for your application.
   - Example:
     ```
     EMAIL_HOST_PASSWORD=your-app-specific-password
     ```

3. **DEFAULT_FROM_EMAIL**:
   - This is the email address that will appear in the "From" field when users receive emails. It can be the same as `EMAIL_HOST_USER` or another email address.
   - Example:
     ```
     DEFAULT_FROM_EMAIL=your-email@gmail.com
     ```


<br>

Run the migrations create the database structure by running:

```
python manage.py makemigrations
```

And then :

```
python manage.py migrate
```

<br>

Create a superuser, you’ll need an admin account to log in to the Django admin panel. Create a superuser by running and fill the necissety fields:

```
python manage.py createsuperuser
```

<br>

Start the development server: Run the Django development server:

```
python manage.py runserver
```

### (Optional) Configure Google Authentication

First, you need to create your API in the [Google Cloud Console](https://cloud.google.com/). Then, follow these steps:

1. In the **Django administration**, go to **Sites** and edit your **domain name**, then hit **Save**.

2. Next, navigate to **Social Applications** and create your Google app for third-party authentication:
   - Set the **Provider** to 'Google'.
   - Give your app a name.
   - Enter your Google app API credentials:
     - **Client ID**: Obtained from creating the Google API authentication app.
     - **Secret Key**: Also obtained from the Google API credentials.

3. Finally, scroll down to the **Sites** section, move your site from the **Available Sites** to **Chosen Sites**, and hit **Save**.

And that’s it! You’re done configuring Google Authentication.

 

### Using SQLite as an Alternative

If you prefer not to use MySQL and want to use SQLite instead, you can follow these steps:

- Remove or Comment Out the database configuration fields in your `.env` file.
- Update Your `settings.py` Open your `settings.py`file and replace the database settings with the following configuration for SQLite:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",  # This will create a SQLite database file in your project directory
    }
}
```


<br>


## Known Issues

- The current version of  is not fully optimized for phone screens. I am aware of this issue and plan to work on improving the mobile responsiveness in future updates.

## Future Updates

- I plan to add a Todo section or app to enhance the functionality of FOXNOTE, making it even more versatile for users.

## Acknowledgements

Thank you for taking the time to explore FOXNOTE! Your feedback and contributions are always welcome as I continue to improve this project.
