import { AppBar, Button, Grid, makeStyles, Toolbar, Typography, Link, Omit } from '@material-ui/core';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import React from 'react';

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  }
}));

export const Header: React.FC = () => {
  const classes = useStyles();

  const LinkToSummary = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>((props, ref) => (
    <RouterLink className={classes.link} innerRef={ref} to="/summary">
      Summary
    </RouterLink>
  ));

  const LinkToVote = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>((props, ref) => (
    <RouterLink className={classes.link} innerRef={ref} to="/">
      Vote
    </RouterLink>
  ));

  return (
    <Grid item component="header">
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            BCBEV: Bund Admin
          </Typography>
          <nav>
            <Link variant="button" color="textPrimary" component={LinkToVote} />
            <Link variant="button" color="textPrimary" component={LinkToSummary} />
          </nav>
          <Button href="#" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};
